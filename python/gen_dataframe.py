import pandas as pd

def load_dispatchers(file_path) -> pd.DataFrame:
    # Load the CSV file without using the first column as index
    df = pd.read_csv(file_path, index_col=False)
    
    # Drop the 'Unnamed: 0' column if it exists
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
    
    # Create a timestamp index with 8-hour frequency
    start_time = pd.Timestamp.now()
    df.index = pd.date_range(start=start_time, periods=len(df), freq='8h')
    
    return df

df = load_dispatchers('python/data/dispatchers_en_22.csv')
print(df.head())
