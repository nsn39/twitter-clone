import uuid
import datetime
from typing import Annotated

from fastapi import FastAPI, Cookie, status, HTTPException, Request
from fastapi.middleware.gzip import GZipMiddleware
from loguru import logger
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import select
from pydantic import BaseModel

from auth import router as auth_router
from auth import get_current_user, get_user
from backend.db.db import session, Post, User

API_PREFIX = "/twitter-clone-api"

app = FastAPI(
    title="twitter-clone",
    openapi_url="/twitter-clone/openapi.json",
    docs_url="/twitter-clone/docs",
    redoc_url="/twitter-clone/redoc"
)

# Set all CORS enabled origins
# TODO: Specify settings.BACKEND_CORS_ORIGINS:
allowed_origins = ['http://localhost:3000', 'http://127.0.0.1:3000',
    'https://localhost:3000', 'https://127.0.0.1:3000'] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(auth_router, prefix=f"{API_PREFIX}/auth")

@app.get(f"{API_PREFIX}/")
async def root():
    return {"app": "twitter-clone"}


@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "OK, I'm fine!"}

class ProfileRequest(BaseModel):
    username: str | None = None    

@app.get(API_PREFIX + "/user_tweets/{username}")
async def get_user_tweets(
    username: str,
    request: Request
):
    try:
        cookies = request.cookies
        user_token = cookies.get("userToken")
        #print("cookie: ", user_token)
        if not user_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authetication cookie not found in client.",
            )

        user = await get_current_user(token=user_token) 
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find logged in user.",
            )
        result = (session.query(Post, User)
                .join(User, Post.user_id == User.id)
                .order_by(Post.created_on.desc())
                .where(User.username == username)
            )
        #print(result)
        tweets = [{**(tweet[1].__dict__), **(tweet[0].__dict__)} for tweet in result.all()]
        #print("Tweets fetched: ", tweets)
        return tweets    
    except Exception as e:
        logger.error(f"Unable to retrieve tweets file. due to {e}")
        return [] 

# GET endpoint
@app.get(f"{API_PREFIX}/tweets")
async def get_tweets(request: Request):
    def get_datetime_from_isoformat(timestamp: str): 
        return datetime.datetime.fromisoformat(timestamp)
    
    try:
        cookies = request.cookies
        user_token = cookies.get("userToken")
        #print("cookie: ", user_token)
        if not user_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authetication cookie not found in client.",
            )

        user = await get_current_user(token=user_token) 
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find logged in user.",
            )
        '''
        with open("data/tweets.json", "r") as fp:
            tweets = json.load(fp)
            # Sort the tweets by timestamp from latest to older ones.
            tweets = sorted(
                tweets, 
                key=lambda x : get_datetime_from_isoformat(x["originalTimestamp"]), 
                reverse=True
            )
        '''
        result = session.query(Post, User).join(User, Post.user_id == User.id).order_by(Post.created_on.desc())
        #print(result)
        tweets = [{**(tweet[1].__dict__), **(tweet[0].__dict__)} for tweet in result.all()]
        #print("Tweets fetched: ", tweets)
        return tweets    
    except Exception as e:
        logger.error(f"Unable to retrieve tweets file. due to {e}")
        return []

@app.get(API_PREFIX + "/active_user/", status_code=200)
async def get_user_profile(
    userToken: Annotated[str, Cookie()]  
):
    try:
        if not userToken:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token received.",
            )
        user = await get_current_user(userToken)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed."
            )
        return user
    except Exception as e:
        logger.error(f"Unable to retrieve profile data due to {e}")
        raise e

@app.get(API_PREFIX + "/profile/{username}", status_code=200)
async def get_user_profile(
    username: str,
    userToken: Annotated[str, Cookie()]  
):
    try:
        if not userToken:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token received.",
            )
        user = await get_current_user(userToken)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed."
            )
        
        if username and user.username != username:
            user = get_user(username)
            
            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="Profile not found."
                )
        return user
    except Exception as e:
        logger.error(f"Unable to retrieve profile data due to {e}")
        raise e


@app.get(API_PREFIX + "/tweet/{id}")
async def get_tweet(id: str, request: Request):
    try:
        cookies = request.cookies
        user_token = cookies.get("userToken")
        #print("cookie found: ", user_token)
        if not user_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authetication cookie not found in client.",
            )

        user = await get_current_user(token=user_token) 
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find logged in user.",
            )
        '''
        with open("data/tweets.json", "r") as fp:
            tweets = json.load(fp)
            for tweet in tweets:
                if id == tweet["id"]:
                    return tweet
            return {
                "msg": "No tweet found."
            }
        '''
        stmt = session.query(Post, User).join(User, Post.user_id == User.id).where(Post.id == id)
        result = stmt.one_or_none()
        
        return {**(result[1].__dict__), **(result[0].__dict__)}
    except Exception as e:
        logger.error(f"Unable to retrieve tweet due to {e}")
        return None

# POST endpoint
@app.post(f"{API_PREFIX}/tweet", status_code=201)
async def post_tweet(tweet: dict, request: Request):
    try:
        cookies = request.cookies
        user_token = cookies.get("userToken")

        if not user_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authetication cookie not found in client.",
            )

        user = await get_current_user(token=user_token) 
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find logged in user.",
            )
        
        logger.info("Tweet: ", tweet)
        tweet_text = tweet.get("tweetText")
        if not tweet_text:
            raise Exception('No tweetText field in the object.')
        '''
        with open("data/tweets.json", "r") as fp:
            tweets = json.loads(fp.read())
            logger.info("Tweets: ", tweets)
            # NodeJS ISOFormat and python datetime ISOFormat not compatible.
            timestamp_isoformat_node = tweet["originalTimestamp"]
            tweet["originalTimestamp"] = timestamp_isoformat_node.rstrip("Z") + "+00:00"
            tweets.append(tweet)
        
        with open("data/tweets.json", "w") as fp:
            json.dump(tweets, fp)
        '''
        # NodeJS ISOFormat and python datetime ISOFormat not compatible.
        timestamp_isoformat_node = tweet["originalTimestamp"]
        tweet_utc_timestamp = timestamp_isoformat_node.rstrip("Z") + "+00:00"
        post_unique_id = uuid.uuid4()
        session.add(Post(
            id=post_unique_id,
            user_id=user.id,
            content=tweet_text,
            created_on=datetime.datetime.fromisoformat(tweet_utc_timestamp),
            last_updated_on=datetime.datetime.fromisoformat(tweet_utc_timestamp)
        ))
        session.commit()
        
        post_stmt = session.query(Post, User).join(User, Post.user_id == User.id).where(Post.id == post_unique_id)
        post_in_db = post_stmt.one_or_none()
        post_dict = {**(post_in_db[1].__dict__), **(post_in_db[0].__dict__)}        
        return post_dict
        
    except Exception as e:
        logger.error(f"Unable to post tweet. due to {e}")
        


@app.on_event("startup")
async def startup():
    logger.info("🎉 Application started at port 8000 🚀")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down.")


'''
    Path ahead:
    1. profile page complete. view tweets of that user only.
    2. setup alembic, git etc.
    3. frontend responsive, other touch ups etc.
'''