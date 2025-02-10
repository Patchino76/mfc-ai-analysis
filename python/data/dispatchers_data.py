# Column name mappings
column_descriptions = {
    'Shift': 'Смяна',
    'DailyOreInput': 'Подадена руда от МГТЛ за денонощието',
    'Stock2Status': 'Състояние на склад №2',
    'CrushedOreSST': 'Натрошена руда от Цех ССТ',
    'Class15': 'Класа 15',
    'Class12': 'Класа 12',
    'TransportedOre': 'Превозена руда до междинни бункери',
    'IntermediateBunkerStatus': 'Състояние на междинни бункери',
    'ProcessedOreMFC': 'Преработена руда в цех МФЦ',
    'OreMoisture': 'Влага на преработената руда',
    'DryProcessedOre': 'Суха преработена руда',
    'Granite': 'Грано',
    'Dikes': 'Дайки',
    'Shale': 'Шисти',
    'GrindingClassPlus0_20mm': 'Смилане класа + 0,20мм',
    'GrindingClassMinus0_08mm': 'Смилане класа -0,08мм',
    'PulpDensity': 'Плътност на пулпа',
    'CopperContentOre': 'Съдържание на мед в рудите по Куриер',
    'CopperContentWaste': 'Съдържание на мед в отпадъка по Куриер',
    'CopperContentConcentrate': 'Съдържание на мед в медния к-т Куриер',
    'TechExtraction': 'Технологично извличане по Куриер',
    'LoadExtraction': 'Товарно извличане',
    'CopperConcentrate': 'Добит меден концентрат',
    'ConcentrateMoisture': 'Влага на медния концентрат',
    'CopperContent': 'Съдържание на мед в медния к-т',
    'MetalCopper': 'Метал мед в медния концентрат',
    'ThickenerWeight': 'Литрово тегло в сгъстителя'
}

#%%
import pandas as pd
import io
from rich import print
import os

#%%
def load_dispatchers_data(file_name = "dispatchers_en_22.csv", return_timestamp_index = False, return_cyrilic_columns = False) -> pd.DataFrame:
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct absolute path to the CSV file
    file_path = os.path.join(script_dir, file_name)
    
    df = pd.read_csv(file_path, index_col=False)
    
    # Drop the 'Unnamed: 0' column if it exists
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
    
    # Create a timestamp index with 8-hour frequency
    start_time = pd.Timestamp('2022-01-01 06:00')
    timestamps = pd.date_range(start=start_time, periods=len(df), freq='8h')
    
    if return_timestamp_index:
        # Add TimeStamp column at the beginning of the DataFrame
        df.insert(0, 'TimeStamp', timestamps.strftime('%Y-%m-%d %H:%M'))
    else:
        # Set timestamps as index
        df.index = timestamps
    
    # Add shift column based on time of day
    # Shift 1: 00:00-07:59, Shift 2: 08:00-15:59, Shift 3: 16:00-23:59
    df['Shift'] = pd.cut(timestamps.hour, 
                        bins=[0, 6, 14, 22], 
                        labels=[1, 2, 3],
                        include_lowest=True)
    
    # Move Shift column to the front
    shift_col = df.pop('Shift')
    df.insert(0 if not return_timestamp_index else 1, 'Shift', shift_col)
    
    if return_cyrilic_columns:
        # Keep TimeStamp in English if it exists
        if 'TimeStamp' in df.columns:
            df.rename(columns={'TimeStamp': 'TimeStamp'}, inplace=True)
            
        # Rename only the columns that exist in both the DataFrame and column_descriptions
        rename_dict = {col: column_descriptions[col] for col in df.columns if col in column_descriptions}
        df.rename(columns=rename_dict, inplace=True)
    
    print(df.head(3))
    
    return df

# %%
def create_data_prompt():
    df = load_dispatchers_data()

    df_head_str = df.head().to_string()
    buffer = io.StringIO()
    df.info(buf=buffer)
    df_info_str = buffer.getvalue()

    prompt = (
        "Below is the structure and a sample of a DataFrame along with metadata for its columns:\n\n"
        "1. Data Sample (first few rows):\n"
        f"{df_head_str}\n\n"
        "2. DataFrame Structure and Info:\n"
        f"{df_info_str}\n\n"
        "3. Column Descriptions (metadata):\n"
        f"{column_descriptions}\n\n"
        "Please analyze this DataFrame structure and metadata."
    )
    return prompt
# %%
prompt = create_data_prompt()
print(prompt)
# %%
