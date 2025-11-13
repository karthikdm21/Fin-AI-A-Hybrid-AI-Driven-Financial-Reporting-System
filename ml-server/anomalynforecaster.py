import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from statsmodels.tsa.arima.model import ARIMA
import warnings
import logging
from typing import List, Dict, Optional, Tuple
import os

# --- Configuration ---
warnings.filterwarnings('ignore')
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- Combined Analysis Module ---
class CompanyAnalyzer:
    """
    Orchestrates anomaly detection and forecasting using a preprocessed DataFrame.
    """
    def __init__(self, preprocessed_csv_path: str):
        """
        Initializes the analyzer by loading and filtering the preprocessed data.
        """
        try:
            logger.info(f"Loading preprocessed data from: {preprocessed_csv_path}")
            self.df = pd.read_csv(preprocessed_csv_path)
            logger.info(f"Preprocessed data loaded successfully with {len(self.df)} total records.")

            # --- THIS IS THE NEW FILTERING STEP ---
            # Group by company and filter out those with less than 4 years of data.
            records_before_filter = len(self.df['Ticker Symbol'].unique())
            self.df = self.df.groupby('Ticker Symbol').filter(lambda x: len(x) >= 4)
            records_after_filter = len(self.df['Ticker Symbol'].unique())
            logger.info(f"Filtered out {records_before_filter - records_after_filter} companies with less than 4 years of data.")
            logger.info(f"Proceeding with analysis for {records_after_filter} companies.")
            # --- END OF NEW FILTERING STEP ---

        except FileNotFoundError:
            logger.error(f"Error: Preprocessed file not found at '{preprocessed_csv_path}'")
            raise
        
        self.anomaly_detector = FinancialAnomalyDetector()
        self.forecaster = FinancialForecaster()
        self.features_for_history = [
            'Total Revenue', 'Net Income', 'Total Assets', 'Earnings Per Share'
        ]

    def _get_historical_data(self, company_df: pd.DataFrame) -> Dict:
        """Pivots historical data for the last 4 years into columns."""
        historical_data = {}
        company_df = company_df.sort_values(by='Year').tail(4)
        
        for feature in self.features_for_history:
            values = company_df[feature].tolist()
            padded_values = np.pad(values, (4 - len(values), 0), 'constant', constant_values=np.nan)
            for i, value in enumerate(padded_values, 1):
                historical_data[f'{feature} Y{i}'] = value
        return historical_data

    def analyze_company(self, ticker: str) -> Optional[Dict]:
        """Runs the full analysis for a single company."""
        company_df = self.df[self.df['Ticker Symbol'] == ticker]
        if company_df.empty:
            return None

        logger.info(f"Analyzing {ticker}...")
        
        anomaly_result = self.anomaly_detector.detect_company_anomalies(company_df, ticker)
        forecast_result = self.forecaster.forecast_company_metrics(company_df, ticker)
        historical_data = self._get_historical_data(company_df)

        combined_record = {
            'Ticker Symbol': ticker,
            'Number of Anomalies': anomaly_result.get('Number of Anomalies', 0),
        }
        for feature in self.forecaster.features_to_forecast:
            combined_record[f'Predicted {feature}'] = forecast_result.get(f'Predicted {feature}')
        combined_record.update(historical_data)
        return combined_record

    def run_full_analysis(self) -> pd.DataFrame:
        """Runs the combined analysis for all companies and returns a DataFrame."""
        all_tickers = self.df['Ticker Symbol'].unique()
        all_results = []
        logger.info(f"Starting combined analysis for {len(all_tickers)} companies.")
        for ticker in all_tickers:
            result = self.analyze_company(ticker)
            if result:
                all_results.append(result)
        logger.info("Combined analysis for all companies is complete.")
        return pd.DataFrame(all_results)


# --- Anomaly Detection Class ---
class FinancialAnomalyDetector:
    """Detects anomalies in financial data using Isolation Forest."""
    def __init__(self):
        self.features = [
            'Current Ratio', 'Quick Ratio', 'Gross Margin',
            'Return on Equity', 'Revenue_Growth_Rate'
        ]

    def detect_company_anomalies(self, company_df: pd.DataFrame, ticker: str) -> Dict:
        """Detects anomalies for a single company."""
        available_features = [f for f in self.features if f in company_df.columns]
        if not available_features:
            return {'Ticker Symbol': ticker, 'Number of Anomalies': 0}

        scaler = StandardScaler()
        features_to_scale = company_df[available_features].fillna(0)

        if features_to_scale.empty or (features_to_scale.std() == 0).all():
            return {'Ticker Symbol': ticker, 'Number of Anomalies': 0}
            
        X_scaled = scaler.fit_transform(features_to_scale)
        iso_forest = IsolationForest(contamination='auto', random_state=42)
        
        company_df_copy = company_df.copy()
        company_df_copy['is_anomaly'] = (iso_forest.fit_predict(X_scaled) == -1).astype(int)
        num_anomalies = company_df_copy['is_anomaly'].sum()
        return {'Ticker Symbol': ticker, 'Number of Anomalies': num_anomalies}


# --- Forecasting Class ---
class FinancialForecaster:
    """Forecasts financial metrics using ARIMA models."""
    def __init__(self, order: Tuple[int, int, int] = (1, 1, 1)):
        self.order = order
        self.features_to_forecast = ['Total Revenue', 'Net Income', 'Total Assets', 'Earnings Per Share']

    def forecast_company_metrics(self, company_df: pd.DataFrame, ticker: str) -> Dict:
        """Forecasts financial metrics for a single company."""
        prediction = {'Ticker Symbol': ticker}
        for feature in self.features_to_forecast:
            if feature not in company_df.columns:
                prediction[f'Predicted {feature}'] = np.nan
                continue
            try:
                time_series = company_df[feature].dropna()
                if len(time_series) >= 3:
                    model = ARIMA(time_series, order=self.order).fit()
                    forecast = model.forecast(steps=1).iloc[0]
                    prediction[f'Predicted {feature}'] = forecast
                else:
                    prediction[f'Predicted {feature}'] = np.nan
            except Exception as e:
                logger.warning(f"Could not generate forecast for {ticker} - {feature}: {e}")
                prediction[f'Predicted {feature}'] = np.nan
        return prediction


# --- Main Execution Block ---
if __name__ == "__main__":
    INPUT_CSV_PATH = 'preprocessed_data.csv' 
    OUTPUT_CSV_PATH = 'combined_financial_analysis_report.csv'

    try:
        analyzer = CompanyAnalyzer(INPUT_CSV_PATH)
        final_report_df = analyzer.run_full_analysis()

        if not final_report_df.empty:
            final_report_df.to_csv(OUTPUT_CSV_PATH, index=False)
            logger.info(f"✅ Combined financial analysis complete. Report saved to '{OUTPUT_CSV_PATH}'")
            print(f"\n--- Report Preview (first 5 rows) ---\n")
            print(final_report_df.head().to_string())
        else:
            logger.warning("Analysis generated an empty report. No data was saved.")

    except FileNotFoundError:
        print(f"\n🔥 FATAL ERROR: The input file '{INPUT_CSV_PATH}' was not found.")
        print("   Please make sure you have a preprocessed CSV file at that location.")
    except Exception as e:
        print(f"\n🔥 An unexpected error occurred: {e}")