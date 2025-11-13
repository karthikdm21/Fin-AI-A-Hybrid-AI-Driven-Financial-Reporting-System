"""
Data Preprocessing Module for Insight AI
Handles data loading, cleaning, and feature engineering.
When run as a standalone script, it saves the output to preprocessed_data.csv.
"""

import pandas as pd
import numpy as np
import logging
from typing import Tuple, Optional
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FinancialDataPreprocessor:
    """Handles preprocessing of financial data for ML analysis"""

    def __init__(self):
        self.df = None
        self.columns_to_keep = [
            'Ticker Symbol', 'Period Ending', 'Accounts Payable', 'Accounts Receivable',
            'Capital Expenditures', 'Cash and Cash Equivalents', 'Cost of Revenue',
            'Current Ratio', 'Depreciation', 'Earnings Before Interest and Tax',
            'Earnings Before Tax', 'Gross Profit', 'Gross Margin', 'Income Tax',
            'Interest Expense', 'Inventory', 'Long-Term Debt',
            'Net Income', 'Operating Income', 'Operating Margin', 'Pre-Tax Margin',
            'Profit Margin', 'Quick Ratio', 'Research and Development', 'Retained Earnings',
            'Short-Term Debt / Current Portion of Long-Term Debt', 'Total Assets',
            'Total Current Assets', 'Total Current Liabilities', 'Total Equity',
            'Total Liabilities', 'Total Liabilities & Equity', 'Total Revenue', 'For Year',
            'Earnings Per Share'
        ]

    def load_data(self, csv_path: str) -> bool:
        """Loads financial data from a CSV file."""
        try:
            logger.info(f"Loading data from {csv_path}")
            self.df = pd.read_csv(csv_path)
            return True
        except FileNotFoundError:
            logger.error(f"Error: '{csv_path}' not found.")
            return False
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return False

    def clean_data(self) -> None:
        """Cleans and prepares the raw data."""
        if self.df is None: return
        logger.info("Starting data cleaning...")
        if 'Unnamed: 0' in self.df.columns:
            self.df = self.df.drop(columns=['Unnamed: 0'])
        
        self.df = self.df[self.columns_to_keep]
        self.df['Period Ending'] = pd.to_datetime(self.df['Period Ending'])
        self.df['Year'] = self.df['Period Ending'].dt.year
        self.df = self.df[self.df['Year'].between(2012, 2015)]
        self.df = self.df.sort_values(by=['Ticker Symbol', 'Year'])
        logger.info("Data cleaning completed.")

    def handle_missing_values(self) -> None:
        """Handles missing values in the dataset."""
        if self.df is None: return
        logger.info("Handling missing values...")
        for col in self.df.select_dtypes(include=['float64', 'int64']).columns:
            self.df[col] = self.df.groupby('Ticker Symbol')[col].transform(lambda x: x.fillna(x.median()))
            self.df[col] = self.df[col].fillna(self.df[col].median())
        logger.info("Missing values handled.")

    def engineer_features(self) -> None:
        """Creates new features for the ML models."""
        if self.df is None: return
        logger.info("Engineering new features...")
        self.df['Return on Equity'] = self.df['Net Income'] / self.df['Total Equity']
        self.df['Revenue_Growth_Rate'] = self.df.groupby('Ticker Symbol')['Total Revenue'].pct_change() * 100
        self.df['Operating Cash Flow'] = self.df['Net Income'] + self.df['Depreciation']
        self.df['Operating_Cash_Flow/Revenue'] = self.df['Operating Cash Flow'] / self.df['Total Revenue']
        self.df['log_Total_Revenue'] = np.log1p(self.df['Total Revenue'])
        self.df['zScore_R&D_Expenses'] = self.df.groupby('Ticker Symbol')['Research and Development'].transform(lambda x: (x - x.mean()) / x.std())
        self.df = self.df.replace([np.inf, -np.inf], np.nan).fillna(0)
        logger.info("Feature engineering completed.")

    def get_preprocessed_data(self) -> Optional[pd.DataFrame]:
        """Returns the preprocessed DataFrame."""
        return self.df.copy() if self.df is not None else None

    def preprocess_pipeline(self, csv_path: str) -> bool:
        """Runs the complete preprocessing pipeline."""
        if not self.load_data(csv_path): return False
        self.clean_data()
        self.handle_missing_values()
        self.engineer_features()
        logger.info("Preprocessing pipeline completed successfully.")
        return True

# --- This is the edited part ---
if __name__ == "__main__":
    """
    When this script is run directly, it will load the raw fundamentals.csv,
    run the full preprocessing pipeline, and save the clean output to
    a new file named 'preprocessed_data.csv'.
    """
    INPUT_CSV_PATH = 'fundamentals.csv'
    OUTPUT_CSV_PATH = 'preprocessed_data.csv'

    preprocessor = FinancialDataPreprocessor()
    success = preprocessor.preprocess_pipeline(INPUT_CSV_PATH)

    if success:
        clean_df = preprocessor.get_preprocessed_data()
        # Save the processed data to a new CSV file
        clean_df.to_csv(OUTPUT_CSV_PATH, index=False)
        logger.info(f"✅ Preprocessing complete. Clean data saved to '{OUTPUT_CSV_PATH}'")
        print(f"\n--- Preprocessed Data Preview ---\n")
        print(clean_df.head().to_string())
    else:
        logger.error("🔥 Preprocessing failed!")