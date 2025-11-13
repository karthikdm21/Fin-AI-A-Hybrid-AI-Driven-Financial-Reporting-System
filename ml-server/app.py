from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from anomalynforecaster import CompanyAnalyzer
from data_preprocessor import FinancialDataPreprocessor
from generate_summary import generate_company_summary
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables to store processed data
processed_data = None
analysis_results = None

def initialize_data():
    """Initialize data processing and analysis on startup"""
    global processed_data, analysis_results
    
    try:
        # Check if preprocessed data exists, if not create it
        if not os.path.exists('preprocessed_data.csv'):
            logger.info("Preprocessed data not found. Running preprocessing pipeline...")
            preprocessor = FinancialDataPreprocessor()
            if preprocessor.preprocess_pipeline('fundamentals.csv'):
                logger.info("Preprocessing completed successfully")
            else:
                logger.error("Preprocessing failed")
                return False
        
        # Load preprocessed data
        processed_data = pd.read_csv('preprocessed_data.csv')
        logger.info(f"Loaded preprocessed data with {len(processed_data)} records")
        
        # Check if combined financial analysis report exists and is up-to-date
        combined_report_path = 'combined_financial_analysis_report.csv'
        preprocessed_path = 'preprocessed_data.csv'
        
        if not os.path.exists(combined_report_path):
            logger.info("Combined financial analysis report not found. Running full analysis...")
            # Run analysis
            analyzer = CompanyAnalyzer('preprocessed_data.csv')
            analysis_results = analyzer.run_full_analysis()
            logger.info(f"Analysis completed for {len(analysis_results)} companies")
        else:
            # Check if the combined report is newer than the preprocessed data
            combined_report_time = os.path.getmtime(combined_report_path)
            preprocessed_time = os.path.getmtime(preprocessed_path)
            
            if combined_report_time < preprocessed_time:
                logger.info("Combined financial analysis report is outdated. Running fresh analysis...")
                # Run analysis
                analyzer = CompanyAnalyzer('preprocessed_data.csv')
                analysis_results = analyzer.run_full_analysis()
                logger.info(f"Analysis completed for {len(analysis_results)} companies")
            else:
                logger.info("Combined financial analysis report is up-to-date. Loading existing data...")
                # Load existing analysis results
                analysis_results = pd.read_csv(combined_report_path)
                logger.info(f"Loaded existing analysis results for {len(analysis_results)} companies")
        
        return True
        
    except Exception as e:
        logger.error(f"Error initializing data: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'data_loaded': processed_data is not None,
        'analysis_complete': analysis_results is not None
    })

@app.route('/api/companies', methods=['GET'])
def get_companies():
    """Get list of companies that exist in the combined financial analysis report"""
    if processed_data is None or analysis_results is None:
        return jsonify({'error': 'Data not initialized'}), 500
    
    try:
        companies = []
        # Only include companies that exist in the analysis results (combined report)
        for _, analysis_row in analysis_results.iterrows():
            ticker = analysis_row['Ticker Symbol']
            
            # Get company data from processed data
            company_data = processed_data[processed_data['Ticker Symbol'] == ticker]
            
            if not company_data.empty:
                # Get latest year data
                latest_year = company_data['Year'].max()
                latest_data = company_data[company_data['Year'] == latest_year].iloc[0]
                
                # Get anomaly count from analysis results
                anomaly_count = analysis_row['Number of Anomalies']
                
                company_info = {
                    'id': ticker.lower(),
                    'name': ticker,
                    'ticker': ticker,
                    'anomalyCount': int(anomaly_count),
                    'latestYear': int(latest_year),
                    'totalRevenue': float(latest_data['Total Revenue']) if pd.notna(latest_data['Total Revenue']) else 0,
                    'netIncome': float(latest_data['Net Income']) if pd.notna(latest_data['Net Income']) else 0,
                    'totalAssets': float(latest_data['Total Assets']) if pd.notna(latest_data['Total Assets']) else 0,
                    'eps': float(latest_data['Earnings Per Share']) if pd.notna(latest_data['Earnings Per Share']) else 0
                }
                companies.append(company_info)
        
        logger.info(f"Returning {len(companies)} companies from combined analysis report")
        return jsonify(companies)
        
    except Exception as e:
        logger.error(f"Error getting companies: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/company/<ticker>', methods=['GET'])
def get_company_details(ticker):
    """Get detailed analysis for a specific company"""
    if processed_data is None or analysis_results is None:
        return jsonify({'error': 'Data not initialized'}), 500
    
    try:
        ticker = ticker.upper()
        company_data = processed_data[processed_data['Ticker Symbol'] == ticker]
        
        if company_data.empty:
            return jsonify({'error': 'Company not found'}), 404
        
        # Get analysis results
        company_analysis = analysis_results[analysis_results['Ticker Symbol'] == ticker]
        
        if company_analysis.empty:
            return jsonify({'error': 'Analysis not available for this company'}), 404
        
        analysis = company_analysis.iloc[0]
        
        # Prepare historical data for charts
        company_data = company_data.sort_values('Year')
        
        # Create revenue data for charts
        revenue_data = []
        for _, row in company_data.iterrows():
            revenue_data.append({
                'year': int(row['Year']),
                'revenue': float(row['Total Revenue']) if pd.notna(row['Total Revenue']) else 0,
                'type': 'historical'
            })
        
        # Add forecast data if available
        if 'Predicted Total Revenue' in analysis and pd.notna(analysis['Predicted Total Revenue']):
            revenue_data.append({
                'year': int(company_data['Year'].max()) + 1,
                'revenue': float(analysis['Predicted Total Revenue']),
                'type': 'forecast'
            })
        
        # Create financial data structure
        financial_data = {
            'totalRevenue': revenue_data,
            'netIncome': [],
            'totalAssets': [],
            'eps': []
        }
        
        # Add other financial metrics
        for _, row in company_data.iterrows():
            financial_data['netIncome'].append({
                'year': int(row['Year']),
                'value': float(row['Net Income']) if pd.notna(row['Net Income']) else 0,
                'type': 'historical'
            })
            
            financial_data['totalAssets'].append({
                'year': int(row['Year']),
                'value': float(row['Total Assets']) if pd.notna(row['Total Assets']) else 0,
                'type': 'historical'
            })
            
            financial_data['eps'].append({
                'year': int(row['Year']),
                'value': float(row['Earnings Per Share']) if pd.notna(row['Earnings Per Share']) else 0,
                'type': 'forecast'
            })
        
        # Add forecast values
        if 'Predicted Net Income' in analysis and pd.notna(analysis['Predicted Net Income']):
            financial_data['netIncome'].append({
                'year': int(company_data['Year'].max()) + 1,
                'value': float(analysis['Predicted Net Income']),
                'type': 'forecast'
            })
        
        if 'Predicted Total Assets' in analysis and pd.notna(analysis['Predicted Total Assets']):
            financial_data['totalAssets'].append({
                'year': int(company_data['Year'].max()) + 1,
                'value': float(analysis['Predicted Total Assets']),
                'type': 'forecast'
            })
        
        if 'Predicted Earnings Per Share' in analysis and pd.notna(analysis['Predicted Earnings Per Share']):
            financial_data['eps'].append({
                'year': int(company_data['Year'].max()) + 1,
                'value': float(analysis['Predicted Earnings Per Share']),
                'type': 'forecast'
            })
        
        company_details = {
            'id': ticker.lower(),
            'name': ticker,
            'ticker': ticker,
            'anomalyCount': int(analysis['Number of Anomalies']),
            'revenueData': revenue_data,
            'financialData': financial_data,
            'analysis': {
                'anomalyCount': int(analysis['Number of Anomalies']),
                'predictedRevenue': float(analysis['Predicted Total Revenue']) if pd.notna(analysis['Predicted Total Revenue']) else None,
                'predictedNetIncome': float(analysis['Predicted Net Income']) if pd.notna(analysis['Predicted Net Income']) else None,
                'predictedTotalAssets': float(analysis['Predicted Total Assets']) if pd.notna(analysis['Predicted Total Assets']) else None,
                'predictedEPS': float(analysis['Predicted Earnings Per Share']) if pd.notna(analysis['Predicted Earnings Per Share']) else None
            }
        }
        
        return jsonify(company_details)
        
    except Exception as e:
        logger.error(f"Error getting company details for {ticker}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    """Get anomaly detection results for all companies"""
    if analysis_results is None:
        return jsonify({'error': 'Analysis not initialized'}), 500
    
    try:
        anomalies = []
        for _, row in analysis_results.iterrows():
            anomaly_info = {
                'id': row['Ticker Symbol'].lower(),
                'name': row['Ticker Symbol'],
                'anomalyCount': int(row['Number of Anomalies']),
                'ticker': row['Ticker Symbol']
            }
            anomalies.append(anomaly_info)
        
        # Sort by anomaly count (descending)
        anomalies.sort(key=lambda x: x['anomalyCount'], reverse=True)
        
        return jsonify(anomalies)
        
    except Exception as e:
        logger.error(f"Error getting anomalies: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get overall summary statistics"""
    if processed_data is None or analysis_results is None:
        return jsonify({'error': 'Data not initialized'}), 500
    
    try:
        total_companies = len(processed_data['Ticker Symbol'].unique())
        total_anomalies = analysis_results['Number of Anomalies'].sum()
        avg_anomalies = total_anomalies / total_companies if total_companies > 0 else 0
        
        summary = {
            'totalCompanies': total_companies,
            'totalAnomalies': int(total_anomalies),
            'averageAnomaliesPerCompany': round(avg_anomalies, 2),
            'dataYearRange': {
                'start': int(processed_data['Year'].min()),
                'end': int(processed_data['Year'].max())
            }
        }
        
        return jsonify(summary)
        
    except Exception as e:
        logger.error(f"Error getting summary: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/company/<ticker>/summary', methods=['GET'])
def get_company_summary(ticker):
    """Get AI-generated summary for a specific company"""
    try:
        ticker = ticker.upper()
        
        # Check if company exists in analysis results
        company_exists = analysis_results[analysis_results['Ticker Symbol'] == ticker]
        if company_exists.empty:
            return jsonify({'error': 'Company not found'}), 404
        
        # Generate AI summary
        logger.info(f"Generating AI summary for {ticker}")
        summary_text = generate_company_summary(ticker)
        
        if summary_text.startswith('Error:'):
            return jsonify({'error': summary_text}), 500
        
        return jsonify({
            'ticker': ticker,
            'summary': summary_text
        })
        
    except Exception as e:
        logger.error(f"Error generating summary for {ticker}: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting FinAI ML Service...")
    
    # Initialize data on startup
    if initialize_data():
        logger.info("✅ Data initialization successful")
        app.run(host='0.0.0.0', port=5001, debug=False)
    else:
        logger.error("🔥 Data initialization failed. Exiting.")
        exit(1)
