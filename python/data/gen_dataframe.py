import pandas as pd
import os

def load_dispatchers(file_name) -> pd.DataFrame:
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the full path to the data file
    file_path = os.path.join(script_dir, 'data', file_name)
    
    # Load the CSV file without using the first column as index
    df = pd.read_csv(file_path, index_col=False)
    
    # Drop the 'Unnamed: 0' column if it exists
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
    
    # Create a timestamp index with 8-hour frequency
    start_time = pd.Timestamp.now()
    df.index = pd.date_range(start=start_time, periods=len(df), freq='8h')
    
    return df

df = load_dispatchers('dispatchers_en_22.csv')
print(df.head())
