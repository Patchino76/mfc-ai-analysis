"""
Configuration settings for the application.
Loads settings from environment variables with sensible defaults.
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # API Settings
    API_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://localhost:3000",
        "http://em-m-db4.ellatzite-med.com:3000",
        "http://em-m-db4.ellatzite-med.com:8000"
    ]
    
    # LLM API Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    
    # LLM Model names
    GEMINI_MODEL: str = "gemini-2.0-flash-thinking-exp-01-21"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    OLLAMA_MODEL: str = "granite3.1-dense:8b"
    
    # Data settings
    DATA_FILE_PATH: str = "data/dispatchers_en_22.csv"
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment value"""
        allowed = ["development", "testing", "production"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v
    
    class Config:
        """Pydantic config"""
        case_sensitive = True
        env_file = ".env"

# Create a global settings object
settings = Settings()

def get_settings() -> Settings:
    """
    Get application settings.
    Used as a dependency in FastAPI for easier testing with overrides.
    
    Returns:
        Settings: Application settings
    """
    return settings
