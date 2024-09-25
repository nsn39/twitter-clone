from datetime import datetime, date
from uuid import uuid4

from sqlalchemy import String, DateTime, Boolean, Date, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

class Post(Base):
    __tablename__ = "post"
    
    id: Mapped[uuid4] = mapped_column(Uuid(), primary_key=True)
    
    content: Mapped[str] = mapped_column(String(900), nullable=False)
    content_type: Mapped[str] = mapped_column(String(20), default="text")
    
    user_id: Mapped[uuid4] = mapped_column(Uuid(), nullable=False)
    
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    last_updated_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    

class User(Base):
    __tablename__ = "user"
    
    id: Mapped[uuid4] = mapped_column(Uuid(), primary_key=True)
    
    fullname: Mapped[str] = mapped_column(String(60), nullable=False)
    username: Mapped[str] = mapped_column(String(60), nullable=False)
    birthdate: Mapped[date] = mapped_column(Date(), nullable=False)
    gender: Mapped[str] = mapped_column(String(30), nullable=False)
    country: Mapped[str] = mapped_column(String(60), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(80), nullable=False)
    phone_no: Mapped[str] = mapped_column(String(30), nullable=False)
    
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    last_updated_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
