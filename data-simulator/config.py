from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    aws_region: str = "us-east-2"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_session_token: Optional[str] = None
    dynamodb_table_prefix: str = "prism-"
    update_interval_seconds: int = 30
    port: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
