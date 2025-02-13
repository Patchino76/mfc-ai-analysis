import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from chat_agents import run_graph
import pandas as pd
from urllib.parse import unquote
import base64

from data.dispatchers_data import create_data_prompt, load_dispatchers_data, get_columns_names_bg
from data_questions import get_df_questions, get_image_description

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
async def get_chat(query: str):
    # Decode URL-encoded query string
    decoded_query = unquote(query)
    # print("Decoded query:", decoded_query)
    
    exec_result = run_graph(decoded_query)
    print("Type of exec_result:", type(exec_result))
    
    if isinstance(exec_result, pd.DataFrame):
        print(exec_result.info())
        exec_result = exec_result.to_dict('records')
        return {"dataframe": exec_result}

    if isinstance(exec_result, str):
        if is_base64_image(exec_result):
            description = get_image_description(query=query, image_b64=exec_result)
            return {"image": exec_result}
        return {"text": exec_result}

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