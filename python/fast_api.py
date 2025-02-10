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
from data.gen_dataframe import load_dispatchers
from chat_agents import run_graph
import pandas as pd
from urllib.parse import unquote
import base64

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
    df = load_dispatchers()
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
    print("Decoded query:", decoded_query)
    
    exec_result = run_graph(decoded_query)
    print("Type of exec_result:", type(exec_result))
    
    if isinstance(exec_result, pd.DataFrame):
        print(exec_result.info())
        exec_result = exec_result.to_dict('records')
        return {"dataframe": exec_result}

    if isinstance(exec_result, str):
        if is_base64_image(exec_result):
            return {"image": exec_result}
        return {"text": exec_result}

if __name__ == "__main__":
    import uvicorn
    # Get environment from .env file
    environment = os.getenv("ENVIRONMENT", "development")
    
    if environment == "development":
        uvicorn.run("fast_api:app", host="localhost", port=8000, reload=True)
    else:
        # For production
        uvicorn.run("fast_api:app", host="0.0.0.0", port=8000, reload=False)