from sqlalchemy import create_engine
from sqlalchemy.orm import Session, DeclarativeBase
from sqlalchemy.ext.declarative import declarative_base

from config import settings

DRIVER = settings.DB_DRIVER
USER = settings.DB_USER
PASSWORD = settings.DB_PASSWORD
HOST = settings.DB_HOST
PORT = settings.DB_PORT
DB_NAME = settings.DB_NAME

DATABASE_URL = f"{DRIVER}://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
session = Session(engine)

# DB declarations
Base = declarative_base()
