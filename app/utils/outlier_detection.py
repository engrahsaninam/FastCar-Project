# app/utils/outlier_detection.py

import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

def detect_outliers(
    data: List[Dict[str, Any]], 
    numeric_columns: List[str] = ['price', 'mileage', 'age'],
    method: str = 'iqr',
    iqr_multiplier: float = 1.5
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Detect outliers in the provided dataset using either IQR or Z-score method.
    """
    if not data:
        return [], []
    
    clean_data = []
    outliers = []
    
    columns = {col: [] for col in numeric_columns}
    
    for item in data:
        for col in numeric_columns:
            if col in item and item[col] is not None:
                columns[col].append(float(item[col]))
                
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

async def filter_mysql_results(
    query: str,
    params: List[Any],
    numeric_columns: List[str] = ['price', 'mileage', 'age'],
    outlier_method: str = 'iqr',
    iqr_multiplier: float = 1.5
) -> List[Dict[str, Any]]:
    """
    Filter MySQL results to remove outliers using Python-based outlier detection.
    """
    from app.database.mysql import execute_query  # Lazy import to avoid circular dependency
    
    # Fetch results without SQL-based outlier filtering
    logger.debug(f"Executing query: {query}")
    logger.debug(f"Query params: {params}")
    
    results = await execute_query(query, params, remove_outliers=False)
    
    if not results or not numeric_columns:
        return results
    
    # Apply Python-based outlier detection
    clean_data, outliers = detect_outliers(
        results,
        numeric_columns=numeric_columns,
        method=outlier_method,
        iqr_multiplier=iqr_multiplier
    )
    
    logger.debug(f"Filtered {len(outliers)} outliers, returning {len(clean_data)} clean records")
    
    return clean_data