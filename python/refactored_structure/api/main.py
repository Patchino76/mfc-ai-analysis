"""
Main FastAPI application module.
This module initializes the FastAPI application with routes, middlewares, and configurations.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import route modules
from api.routes.chat import router as chat_router
from api.routes.data import router as data_router
from api.routes.analysis import router as analysis_router

# Import core modules
from core.config import settings
from core.logging import configure_logging

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: Configured FastAPI application
    """
    # Initialize FastAPI app with metadata
    app = FastAPI(
        title="MFC AI Analysis API",
        description="API for AI-powered data analysis in mining industry",
        version="1.0.0",
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])
    app.include_router(data_router, prefix="/api/v1/data", tags=["data"])
    app.include_router(analysis_router, prefix="/api/v1/analysis", tags=["analysis"])
    
    # Add startup event
    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting up MFC AI Analysis API")
    
    # Add shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Shutting down MFC AI Analysis API")
    
    return app

# Create the FastAPI application
app = create_application()

if __name__ == "__main__":
    import uvicorn
    
    # Get environment configuration
    environment = os.getenv("ENVIRONMENT", "development")
    
    # Run the server with appropriate settings for the environment
    if environment == "development":
        uvicorn.run("api.main:app", host=settings.HOST, port=settings.PORT, reload=True)
    else:
        uvicorn.run("api.main:app", host=settings.HOST, port=settings.PORT, reload=False)
