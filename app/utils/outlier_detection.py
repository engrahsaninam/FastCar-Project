# app/utils/outlier_detection.py

import numpy as np
from typing import List, Dict, Any, Tuple, Optional

def detect_outliers(
    data: List[Dict[str, Any]], 
    numeric_columns: List[str] = ['price', 'mileage', 'age'],
    method: str = 'iqr',
    iqr_multiplier: float = 1.5
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Detect outliers in the provided dataset using either IQR or Z-score method.
    
    Args:
        data: List of dictionaries containing the data
        numeric_columns: Columns to check for outliers
        method: 'iqr' for Interquartile Range or 'zscore' for Z-score method
        iqr_multiplier: Multiplier for IQR to determine outlier threshold (default: 1.5)
        
    Returns:
        Tuple containing (clean_data, outliers)
    """
    if not data:
        return [], []
    
    clean_data = []
    outliers = []
    
    # Convert data to column-based format for easier statistical calculations
    columns = {col: [] for col in numeric_columns}
    
    for item in data:
        for col in numeric_columns:
            if col in item and item[col] is not None:
                columns[col].append(float(item[col]))
                
    # Calculate thresholds for each column
    thresholds = {}
    
    for col in numeric_columns:
        col_data = columns[col]
        if not col_data:
            continue
            
        if method == 'iqr':
            q1 = np.percentile(col_data, 25)
            q3 = np.percentile(col_data, 75)
            iqr = q3 - q1
            lower_bound = q1 - (iqr_multiplier * iqr)
            upper_bound = q3 + (iqr_multiplier * iqr)
            thresholds[col] = (lower_bound, upper_bound)
            
        elif method == 'zscore':
            mean = np.mean(col_data)
            std = np.std(col_data)
            lower_bound = mean - (3 * std)
            upper_bound = mean + (3 * std)
            thresholds[col] = (lower_bound, upper_bound)
    
    # Classify each item as clean or outlier
    for item in data:
        is_outlier = False
        
        for col in numeric_columns:
            if col in item and item[col] is not None and col in thresholds:
                lower_bound, upper_bound = thresholds[col]
                if float(item[col]) < lower_bound or float(item[col]) > upper_bound:
                    is_outlier = True
                    break
                    
        if is_outlier:
            outliers.append(item)
        else:
            clean_data.append(item)
            
    return clean_data, outliers


def filter_mysql_results(
    results: List[Dict[str, Any]], 
    outlier_method: str = 'iqr'
) -> List[Dict[str, Any]]:
    """
    Filter MySQL results to remove outliers.
    
    Args:
        results: Results from MySQL query
        outlier_method: Method to use for outlier detection ('iqr' or 'zscore')
        
    Returns:
        Clean results with outliers removed
    """
    if not results:
        return results
        
    clean_data, _ = detect_outliers(results, method=outlier_method)
    return clean_data