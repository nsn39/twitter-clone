from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Project Information
    PROJECT_NAME: str = 'twitter-clone-backend'
    API_PREFIX: str = 'twitter-clone-api'
    ENVIRONMENT: str = 'dev'
    DOMAIN_NAME: str = 'localhost'
    
    # Database credentials
    DB_DRIVER: str = 'postgresql'
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str

    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
settings = Settings()