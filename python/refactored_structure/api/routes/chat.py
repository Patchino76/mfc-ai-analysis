"""
Chat API routes for handling chat interactions with the AI.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from urllib.parse import unquote
from typing import Dict, Any, Optional
import logging

# Import services
from services.chat.workflows import process_chat_query, ChatResult
from services.analysis.questions import get_combined_analysis

# Import schemas
from models.schemas.chat import ChatResponse

# Import dependencies
from core.config import get_settings, Settings

# Initialize router
router = APIRouter()
logger = logging.getLogger(__name__)

# Create in-memory store for conversation state
# In a production environment, this should be replaced with a proper database
conversation_store = {
    "current_query": None,
    "current_processed_results": None
}

@router.get("/", response_model=ChatResponse)
async def get_chat(
    query: str, 
    message_index: int = 0,
    settings: Settings = Depends(get_settings)
):
    """
    Process a chat query and return results.
    
    Args:
        query: User query string (URL encoded)
        message_index: Index of the message to retrieve (for streaming responses)
        settings: Application settings
        
    Returns:
        ChatResponse: The response data and metadata
    """
    global conversation_store
    
    # Decode URL-encoded query string
    decoded_query = unquote(query)
    logger.info(f"Processing chat query: {decoded_query}")
    
    # Only run the workflow when message_index is 0
    if message_index == 0:
        try:
            results = process_chat_query(decoded_query)
            
            # Store in conversation store
            conversation_store["current_query"] = decoded_query
            conversation_store["current_processed_results"] = results
            
            logger.info(f"Generated {len(results)} results for query")
        except Exception as e:
            logger.error(f"Error processing chat query: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")
    
    # Retrieve and return the requested message
    current_results = conversation_store["current_processed_results"]
    
    if current_results and message_index < len(current_results):
        return {
            "data": current_results[message_index],
            "hasMore": message_index < len(current_results) - 1
        }
    else:
        return {
            "data": None,
            "hasMore": False
        }

@router.get("/explanations")
def get_explanations(settings: Settings = Depends(get_settings)):
    """
    Get explanations for the most recent chat query results.
    
    Args:
        settings: Application settings
        
    Returns:
        Dict: Explanation text
    """
    if (conversation_store["current_query"] is None or 
        conversation_store["current_processed_results"] is None):
        return {"explanation": "No analysis results found"}
    
    try:
        explanation = get_combined_analysis(
            conversation_store["current_query"],
            conversation_store["current_processed_results"]
        )
        return {"explanation": explanation}
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        return {"explanation": f"Error generating explanation: {str(e)}"}
