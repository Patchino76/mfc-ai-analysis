from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict

from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from gen_dataframe import load_dispatchers
from chat_agents import run_graph
import pandas as pd
from urllib.parse import unquote

app = FastAPI()
origins = ["http://localhost:3000", "https://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dispatchers", response_model=List[Dict[str, Any]])
def get_dispatchers_df():
    df = load_dispatchers('python/data/dispatchers_en_22.csv')
    return df.to_dict('records')


@app.get("/chat")
def get_chat(query: str, response_model=Dict[str, Any]):
    # Decode URL-encoded query string
    decoded_query = unquote(query)
    print("Decoded query:", decoded_query)
    
    exec_result = run_graph(decoded_query)
    
    
    # Convert DataFrame to records if needed
    if isinstance(exec_result, pd.DataFrame):
        print(exec_result.info())
        exec_result = exec_result.to_dict('records')
        return {"dataframe": exec_result}

    if isinstance(exec_result, str):
        return {"text": exec_result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fast_api:app", host="localhost", port=8000, reload=True)