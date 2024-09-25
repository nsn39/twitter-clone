from sqlalchemy import create_engine
from sqlalchemy.orm import Session, DeclarativeBase
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("postgresql://nishan:nishan@localhost:5433/nishan")
session = Session(engine)

# DB declarations
Base = declarative_base()
