from datetime import datetime, date
from uuid import uuid4
from typing import List

from sqlalchemy import String, DateTime, Boolean, Date, Uuid, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

class Post(Base):
    __tablename__ = "post"
    
    id: Mapped[uuid4] = mapped_column(Uuid(), primary_key=True)
    
    content: Mapped[str] = mapped_column(String(900), nullable=True)
    secondary_content_type: Mapped[str] = mapped_column(String(20), default="image", nullable=True)
    secondary_content_file_id: Mapped[str] = mapped_column(String(100), nullable=True)
    post_type: Mapped[str] = mapped_column(String(30), server_default="tweet")
    
    user_id: Mapped[uuid4] = mapped_column(Uuid(), nullable=False)
    parent_post_ref: Mapped[uuid4] = mapped_column(Uuid(), nullable=True)
    
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    last_updated_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    # tweet, retweet, quote-tweet, reply
    '''
    user: Mapped["User"] = relationship(back_populates="posts")
    analytics: Mapped["PostAnalytics"] = relationship(back_populates="post")
    '''

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
    profile_pic_filename: Mapped[str] = mapped_column(String(200), nullable=True)
    bio_text: Mapped[str] = mapped_column(String(300), nullable=True)
    location: Mapped[str] = mapped_column(String(50), nullable=True)
    website: Mapped[str] = mapped_column(String(50), nullable=True)
    
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    last_updated_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    '''
    posts: Mapped[List["Post"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    analytics: Mapped["UserAnalytics"] = relationship(back_populates="user")
    '''

class PostLikedBy(Base):
    __tablename__ = "post_liked_by"
    
    post_id: Mapped[uuid4] = mapped_column(ForeignKey("post.id"), primary_key=True)
    user_id: Mapped[uuid4] = mapped_column(ForeignKey("user.id"), primary_key=True)
    liked_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())

class PostAnalytics(Base):
    __tablename__ = "post_analytics"
    
    post_id: Mapped[uuid4] = mapped_column(ForeignKey("post.id"), primary_key=True)
    
    likes_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    retweets_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    quotes_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    replies_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    
    '''
    post: Mapped["Post"] = relationship(back_populates="analytics")
    '''

class UserFollowedBy(Base):
    __tablename__ = "user_followed_by"
    
    follower_id: Mapped[uuid4] = mapped_column(ForeignKey("user.id"), primary_key=True)
    followed_id: Mapped[uuid4] = mapped_column(ForeignKey("user.id"), primary_key=True) 
    followed_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())

class UserAnalytics(Base):
    __tablename__ = "user_analytics"
    
    user_id: Mapped[uuid4] = mapped_column(Uuid(), primary_key=True) 

    follower_count: Mapped[int] = mapped_column(Integer, nullable=False)
    following_count: Mapped[int] = mapped_column(Integer, nullable=False)
    posts_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    
    '''
    user: Mapped["User"] = relationship(back_populates="analytics")
    '''
    
class Notifications(Base):
    __tablename__ = "notifications"
    
    id: Mapped[uuid4] = mapped_column(Uuid(), primary_key=True)
    
    origin_user_id: Mapped[uuid4] = mapped_column(ForeignKey("user.id"), nullable=False)
    recipient_id: Mapped[uuid4] = mapped_column(ForeignKey("user.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(30), nullable=False)
    post_id: Mapped[uuid4] = mapped_column(ForeignKey("post.id"), nullable=True)
    seen: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())
    last_updated_on: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.now())