import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict, Literal
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv(override=True)

from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from chat_agents import run_graph
import pandas as pd
from urllib.parse import unquote
import base64

from data.dispatchers_data import create_data_prompt, load_dispatchers_data, get_columns_names_bg
from data_questions import get_df_questions, get_image_analysis, get_df_analysis

# Configure logging
logging.getLogger('uvicorn.access').setLevel(logging.WARNING)

app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://em-m-db4.ellatzite-med.com:3000",
    "http://em-m-db4.ellatzite-med.com:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dispatchers", response_model=List[Dict[str, Any]])
def get_dispatchers_df():
    df = load_dispatchers_data(return_timestamp_index = True, return_cyrilic_columns=True)
    return df.to_dict('records')


def is_base64_image(s: str) -> bool:
    try:
        # Try to decode the string
        decoded = base64.b64decode(s)
        # Check if it starts with common image headers
        return decoded.startswith((
            b'\x89PNG\r\n\x1a\n',  # PNG
            b'\xff\xd8\xff',       # JPEG
            b'GIF87a',             # GIF
            b'GIF89a'              # GIF
        ))
    except:
        return False

@app.get("/chat")
async def get_chat(query: str, message_index: int = 0):
    # Decode URL-encoded query string
    decoded_query = unquote(query)
    
    exec_result = run_graph(decoded_query)
    print("Type of exec_result:", type(exec_result))
    
    # Check if exec_result is a list of dictionaries with dataframe or graph keys
    if isinstance(exec_result, list) and all(
        isinstance(item, dict) and ('dataframe' in item or 'graph' in item)
        for item in exec_result
    ):
        processed_results = []
        for item in exec_result:
            processed_item = {}
            if 'dataframe' in item and isinstance(item['dataframe'], pd.DataFrame):
                df_dict = item['dataframe'].to_dict('records')
                processed_item['dataframe'] = df_dict
            elif 'graph' in item and isinstance(item['graph'], str) and is_base64_image(item['graph']):
                processed_item['graph'] = item['graph']
            else:
                processed_item = item
            processed_results.append(processed_item)
        
        # Return next message if available, otherwise return empty response
        if message_index < len(processed_results):
            return {
                "data": processed_results[message_index],
                "hasMore": message_index < len(processed_results) - 1
            }
        else:
            return {
                "data": None,
                "hasMore": False
            }
    
    return False

@app.get("/explanations")
def get_explanations(query: str, data:str, type: Literal["dataframe", "graph"]):
    print("query:", query)
    print("data:", data)
    print("type:", type)
    if type == "dataframe":
        explanation = get_df_analysis(query=query, df_result=data)
    elif type == "graph":
        explanation = get_image_analysis(query=query, image_b64=data)
    else:
        explanation = "Invalid type"

    explanation = {"text": explanation}
    return explanation



@app.get("/column_names")
def get_columns_names():
    return get_columns_names_bg()

@app.get("/df_questions") #, response_model=List[Dict[str, Any]]
def df_questions(question: str = "", selectedParams: str = ""):
    print("Query: ", question)
    print("Params: ", selectedParams)
    result =  get_df_questions(question, selectedParams)
    print("Result: ", result)
    return result



if __name__ == "__main__":
    import uvicorn
    # Get environment from .env file
    environment = os.getenv("ENVIRONMENT", "development")
    
    if environment == "development":
        uvicorn.run("fast_api:app", host="localhost", port=8000, reload=True)
    else:
        # For production
        uvicorn.run("fast_api:app", host="0.0.0.0", port=8000, reload=False)