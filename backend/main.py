import os
import uuid
import datetime
from typing import Annotated

from fastapi import (
    FastAPI, Cookie, status, HTTPException, 
    Request, UploadFile, Form, File, Response,
    BackgroundTasks
)
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, Response
from loguru import logger
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import select, update, delete
from pydantic import BaseModel

from endpoints.notifications import router as notfications_router
from endpoints.websocket import router as websocket_router
from auth import router as auth_router
from auth import get_current_user, get_user
from db.db import session 
from db.models import (
    Post, User, PostLikedBy, 
    PostAnalytics, UserAnalytics, UserFollowedBy, Notifications
)
from tasks.notifications import (
    create_follow_notification,
    create_like_notification,
    create_post_notification
)

API_PREFIX = "/twitter-clone-api"
USER_FILES_PATH = "/home/nishan/Practice/temp_fs/"

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
app.include_router(notfications_router, prefix=f"{API_PREFIX}")
app.include_router(websocket_router, prefix=f"{API_PREFIX}")

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
        result = (
            session.query(Post, User)
            .join(User, Post.user_id == User.id)
            .order_by(Post.created_on.desc())
            .where(User.username == username)
            .where(Post.post_type != "reply")
        )
        
        tweets = [{**(tweet[1].__dict__), **(tweet[0].__dict__)} for tweet in result.all()]
        for tweet in tweets:
            tweet["parent_post"] = None
            if parent_ref_id := tweet.get("parent_post_ref"):
                result = session.scalars(
                    select(Post)
                    .where(Post.id == parent_ref_id)
                )
                parent_post_obj = result.one_or_none()
                if parent_post_obj:
                    #tweet["parent_post"] = parent_post_obj.__dict__
                    user_id = parent_post_obj.user_id
                    result = session.scalars(
                        select(User)
                        .where(User.id == user_id)
                    )
                    parent_post_user = result.one_or_none()
                    if parent_post_user:
                        tweet["parent_post"] = {**(parent_post_user.__dict__), **(parent_post_obj.__dict__)}

        return tweets    
    except Exception as e:
        logger.error(f"Unable to retrieve tweets file. due to {e}")
        return [] 
    
@app.get(f"{API_PREFIX}/replies/" + "{tweet_id}")
async def get_tweet_replies(
    tweet_id: str,
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
            
        replies_query = session.execute(
            select(Post, User)
            .join(User, Post.user_id == User.id)
            .where(Post.post_type == "reply")
            .where(Post.parent_post_ref == tweet_id)
            .order_by(Post.created_on.desc())
        )
        replies_result = replies_query.fetchall()
        if replies_result:
            replies = [{**(item[1].__dict__), **(item[0].__dict__)} for item in replies_result]
            return replies
        else:
            return []
        
    except Exception as e:
        logger.error(f"Unable to send replies due to: {e}")
        raise e

@app.get(f"{API_PREFIX}/post_analytics/" + "{post_id}")
async def get_post_analytics(
    post_id: str,
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
        
        post_analytics_query = session.scalars(
            select(PostAnalytics)
            .where(PostAnalytics.post_id == post_id)
        )
        post_analytics_obj = post_analytics_query.one_or_none()
        if post_analytics_obj:
            return post_analytics_obj.__dict__
        else:
            return None
        
    except Exception as e:
        logger.error(f"Unable to retrieve analytics due to: {e}")
        raise e
    
@app.get(f"{API_PREFIX}/user_analytics/" + "{user_id}")
async def get_post_analytics(
    user_id: str,
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
        user_analytics_query = session.scalars(
            select(UserAnalytics)
            .where(UserAnalytics.user_id == user_id)
        )
        user_analytics_obj = user_analytics_query.one_or_none()
        if user_analytics_obj:
            return user_analytics_obj.__dict__
        else:
            return None    
        
    except Exception as e:
        logger.error(f"Unable to retrieve analytics due to: {e}")
        raise e

# GET endpoint
@app.get(f"{API_PREFIX}/tweets")
async def get_tweets(request: Request):
    def get_datetime_from_isoformat(timestamp: str): 
        return datetime.datetime.fromisoformat(timestamp)
    
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
        result = (
            session.query(Post, User)
            .join(User, Post.user_id == User.id)
            .where(Post.post_type != "reply")
            .order_by(Post.created_on.desc())
        )
        
        tweets = [{**(tweet[1].__dict__), **(tweet[0].__dict__)} for tweet in result.all()]
        
        #TODO: take only the fields required in the FE and send as response. no need to **(tweet.__dict__)
        for tweet in tweets:
            tweet["parent_post"] = None
            if parent_ref_id := tweet.get("parent_post_ref"):
                result = session.scalars(
                    select(Post)
                    .where(Post.id == parent_ref_id)
                )
                parent_post_obj = result.one_or_none()
                if parent_post_obj:
                    #tweet["parent_post"] = parent_post_obj.__dict__
                    user_id = parent_post_obj.user_id
                    result = session.scalars(
                        select(User)
                        .where(User.id == user_id)
                    )
                    parent_post_user = result.one_or_none()
                    if parent_post_user:
                        tweet["parent_post"] = {**(parent_post_user.__dict__), **(parent_post_obj.__dict__)}

        return tweets    
    except Exception as e:
        logger.error(f"Unable to retrieve tweets file. due to {e}")
        return []

@app.delete(API_PREFIX + "/tweet/{post_id}", status_code=204)
async def delete_tweet(
    post_id: str,
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
        
        post_query = session.scalars(
            select(Post)
            .where(Post.id == post_id)
        )
        post_obj = post_query.one_or_none()
        if post_obj.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User doesn't have permission to delete this post.",
            )
        else:
            # TODO: decrease retweet replies count.
            # Delete all related replies, quotes and retweets.
            '''
            session.execute(
                delete(Post)
                .where(Post.parent_post_ref == post_obj.id)
            )
            '''
            # Delete all replies
            # Delete reply analytics first.
            replies_query = session.scalars(
                select(Post)
                .where(Post.post_type == "reply")
                .where(Post.parent_post_ref == post_id)
            )
            replies_list = replies_query.fetchall()
            replies_ids = [item.id for item in replies_list]
            for id in replies_ids:
                session.execute(
                    delete(Notifications)
                    .where(Notifications.post_id == id)
                )
                session.execute(
                    delete(PostLikedBy)
                    .where(PostLikedBy.post_id == id)
                )
                session.execute(
                    delete(PostAnalytics)
                    .where(PostAnalytics.post_id == id)
                )
            
            session.execute(
                delete(Post)
                .where(Post.post_type == "reply")
                .where(Post.parent_post_ref == post_id)
            )
            
            # Delete all retweets..
            retweets_query = session.scalars(
                select(Post)
                .where(Post.post_type == "retweet")
                .where(Post.parent_post_ref == post_id)
            )
            retweets_list = retweets_query.fetchall()
            retweets_ids = [item.id for item in retweets_list]
            for id in retweets_ids:
                session.execute(
                    delete(Notifications)
                    .where(Notifications.post_id == id)
                )
            
            session.execute(
                delete(Post)
                .where(Post.post_type == "retweet")
                .where(Post.parent_post_ref == post_id)
            )
            
            session.execute(
                delete(PostLikedBy)
                .where(PostLikedBy.post_id == post_obj.id)
            )
            
            session.execute(
                delete(PostAnalytics)
                .where(PostAnalytics.post_id == post_obj.id)
            )
            
            session.execute(
                delete(Notifications)
                .where(Notifications.post_id == post_obj.id)
            )
            
            session.delete(post_obj)
            session.commit()
        
    except Exception as e:
        logger.error(f"Unable to delete tweet due to: {e}")
        raise e

@app.get(API_PREFIX + "/who_to_follow", status_code=200)
async def get_who_to_follow(
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
        
        follow_rec_query = session.scalars(
            select(User)
            .where(User.id != user.id)
            .limit(4)
        )
        follow_rec_results = follow_rec_query.fetchall()
        if len(follow_rec_results) > 0:
            return [item.__dict__ for item in follow_rec_results]
        else:
            return []
        
    except Exception as e:
        logger.error("Unable to give recommendations due to: {e}");

@app.get(API_PREFIX + "/search/{search_input}", status_code=200)
async def get_search_results(
    search_input: str,
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
            
        search_fullname_query = session.scalars(
            select(User)
            .where(User.id != user.id)
            .where(User.fullname.ilike(f"{search_input}%"))
        )
        search_fullname_results = search_fullname_query.fetchall()
        if len(search_fullname_results) > 0:
            return [item.__dict__ for item in search_fullname_results]
        else:
            return []
    
    except Exception as e:
        logger.error(f"Unable to send search results due to: {e}")
        raise e
    
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

@app.patch(API_PREFIX + "/profile/", status_code=200)
async def update_profile(
    profile_pic: Annotated[UploadFile, File()],
    userToken: Annotated[str, Cookie()],
    fullname: Annotated[str, Form()] = "",
    bio: Annotated[str, Form()] = "",
    location: Annotated[str, Form()] = "",
    website: Annotated[str, Form()] = ""
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
            
        # Save the file to local file system
        file_data = await profile_pic.read()
        temp_file_name = str(uuid.uuid4())
        with open(USER_FILES_PATH + temp_file_name, "wb") as fp:
            fp.write(file_data)
            
        session.execute(
            update(User)
            .where(User.username == user.username)
            .values(
                profile_pic_filename=temp_file_name,
                fullname=fullname, 
                bio_text=bio, 
                location=location,
                website=website
            )
        )
        session.commit()
        return {"username": user.username}
        
    except Exception as e:
        logger.error(f"Unable to update profile data due to {e}")
        raise e
    
@app.post(API_PREFIX + "/like/{post_id}", status_code=201)
async def like_post(
    post_id: str, 
    userToken: Annotated[str, Cookie()],
    background_tasks: BackgroundTasks
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
        # Check if the post is already liked.
        result = session.scalars(
            select(PostLikedBy)
            .where(PostLikedBy.user_id == user.id)
            .where(PostLikedBy.post_id == post_id)
        )
        post_liked_obj = result.one_or_none()
        print("Post liked obj: ", post_liked_obj)
        
        if not post_liked_obj:
            session.add(PostLikedBy(post_id=post_id, user_id=user.id))
            # increment the counter as well
            result = session.scalars(
                select(PostAnalytics)
                .where(PostAnalytics.post_id == post_id)
            )
            post_analytics_obj = result.one_or_none()
            if not post_analytics_obj:
                session.add(PostAnalytics(post_id=post_id, likes_count=1))
            else:
                print("obj: ", post_analytics_obj)
                likes_count = post_analytics_obj.likes_count
                session.execute(
                    update(PostAnalytics)
                    .where(PostAnalytics.post_id == post_id)
                    .values(likes_count = likes_count + 1)
                )
            session.commit()
            background_tasks.add_task(create_like_notification, user, post_id)
        else:
            raise Exception("Post is already liked by the user.")
        
    except Exception as e:
        logger.error(f"Unable to perform Like tweet due to {e}")
        return None 

@app.get(API_PREFIX + "/has_retweeted/{post_id}", status_code=200)
async def check_already_retweeted(post_id: str, userToken: Annotated[str, Cookie()]):
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
        retweet_query = session.scalars(
            select(Post)
            .where(Post.parent_post_ref == post_id)
            .where(Post.post_type == "retweet")
            .where(Post.user_id == user.id)
        )
        retweet_obj = retweet_query.one_or_none()
        if retweet_obj:
            return Response(
                status_code=200,
                content=None
            )
        else:
            return Response(
                status_code=204,
                content=None
            )
            
    except Exception as e:
        logger.error(f"Unable to retrieved retweet relation due to: {e}")
        raise e

@app.get(API_PREFIX + "/has_liked/{post_id}", status_code=200)
async def check_like_exists(post_id: str, userToken: Annotated[str, Cookie()]):
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
        
        result = session.scalars(
            select(PostLikedBy)
            .where(PostLikedBy.post_id == post_id)
            .where(PostLikedBy.user_id == user.id)
        )
        post_liked_obj = result.one_or_none()
        if post_liked_obj:
            return Response(status_code=200, content="Post liked.")
        else:
            return Response(status_code=404, content="Post not liked yet.")
        
    except Exception as e:
            logger.error(f"Unable to check like status due to {e}")
            raise e

@app.delete(API_PREFIX + "/unlike/{post_id}", status_code=204)
async def unlike_post(post_id: str, userToken: Annotated[str, Cookie()]):
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
        # Check if the post is already liked.
        result = session.scalars(
            select(PostLikedBy)
            .where(PostLikedBy.user_id == user.id)
            .where(PostLikedBy.post_id == post_id)
        )
        post_liked_obj = result.one_or_none()
        print("Post liked obj: ", post_liked_obj)
        
        if post_liked_obj:
            session.delete(post_liked_obj)
            session.commit()
            #decrement the counter
            result = session.scalars(
                select(PostAnalytics)
                .where(PostAnalytics.post_id == post_id)
            )
            post_analytics_obj = result.one_or_none()
            if post_analytics_obj:
                print("obj: ", post_analytics_obj)
                likes_count = post_analytics_obj.likes_count
                session.execute(
                    update(PostAnalytics)
                    .where(PostAnalytics.post_id == post_id)
                    .values(likes_count = max(0, likes_count-1))
                ) 
            session.commit()
        else:
            raise Exception("Post is never liked by the user to be unliked.")
    except Exception as e:
            logger.error(f"Unable to Unlike tweet due to {e}")
            return None
    
def get_id_from_username(input: str):
    result = session.scalars(
        select(User)
        .where(User.username == input)
    )
    user_obj = result.one_or_none()
    if user_obj:
        return user_obj.id
    else:
        return None

@app.get(API_PREFIX + "/is_following/{username}", status_code=200)
async def does_user_follow_profile(username: str, userToken: Annotated[str, Cookie()]):
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
        
        profile_id = get_id_from_username(username)
        print("username: ", profile_id)
        result = session.scalars(
            select(UserFollowedBy)
            .where(UserFollowedBy.follower_id == user.id)
            .where(UserFollowedBy.followed_id == profile_id)
        )
        
        user_followed_obj = result.one_or_none()
        if user_followed_obj:
            return Response(
                status_code=200,
                content=None
            )
        else:
            return Response(
                status_code=204,
                content=None
            )
        
    except Exception as e:
        logger.error(f"Unable to check follow relation due to {e}")
        raise e

@app.post(API_PREFIX + "/follow/{username}", status_code=201)
async def follow_profile(
    username: str, 
    userToken: Annotated[str, Cookie()],
    background_tasks: BackgroundTasks
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
        
        # Check if user is already followed.
        profile_id = get_id_from_username(username)
        result = session.scalars(
            select(UserFollowedBy)
            .where(UserFollowedBy.follower_id == user.id)
            .where(UserFollowedBy.followed_id == profile_id)
        )
        user_followed_obj = result.one_or_none()
        if not user_followed_obj:
            session.add(UserFollowedBy(follower_id=user.id, followed_id=profile_id))
            session.commit()
        else:
            raise HTTPException(
                status=201,
                detail="The UserFollowedBy relation already exists."
            )
        
        result = session.scalars(
            select(UserAnalytics)
            .where(UserAnalytics.user_id == user.id)
        )
        active_user_analytics_obj = result.one_or_none()
        if not active_user_analytics_obj:
            session.add(
                UserAnalytics(
                    user_id=user.id,
                    follower_count=0,
                    following_count=1
                )
            )
        else:
            following_count = active_user_analytics_obj.following_count
            session.execute(
                update(UserAnalytics)
                .where(UserAnalytics.user_id == user.id)
                .values(following_count = following_count + 1)
            )
        
        result = session.scalars(
            select(UserAnalytics)
            .where(UserAnalytics.user_id == profile_id)
        )
        profile_user_analytics_obj = result.one_or_none()
        if not profile_user_analytics_obj:
            session.add(
                UserAnalytics(
                    user_id=profile_id,
                    follower_count=1,
                    following_count=0
                )
            )
        else:
            follower_count = profile_user_analytics_obj.follower_count
            session.execute(
                update(UserAnalytics)
                .where(UserAnalytics.user_id == profile_id)
                .values(follower_count = follower_count + 1)
            )
        session.commit()
        
        background_tasks.add_task(create_follow_notification, user, profile_id)
        return Response(
            status_code=201,
            content="UserFollowedBy relation created successfully."
        )
    except Exception as e:
        logger.error(f"Unable to add a UserFollowedBy relation due to {e}")
        raise e 

@app.delete(API_PREFIX + "/unfollow/{username}", status_code=204)
async def unfollow_profile(username: str, userToken: Annotated[str, Cookie()]):
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
        
        profile_id = get_id_from_username(username)
        # Check if user is already followed.
        result = session.scalars(
            select(UserFollowedBy)
            .where(UserFollowedBy.follower_id == user.id)
            .where(UserFollowedBy.followed_id == profile_id)
        )
        user_followed_obj = result.one_or_none()
        if user_followed_obj:
            session.delete(user_followed_obj)
            session.commit()
        else:
            raise HTTPException(
                status=401,
                detail="The UserFollowedBy relation doesn't exist for it to be removed."
            )
        
        result = session.scalars(
            select(UserAnalytics)
            .where(UserAnalytics.user_id == user.id)
        )
        active_user_analytics_obj = result.one_or_none()
        if not active_user_analytics_obj:
            logger.error(f"UserAnalyticsObj for user {user.id} not found.")
        else:
            following_count = active_user_analytics_obj.following_count
            session.execute(
                update(UserAnalytics)
                .where(UserAnalytics.user_id == user.id)
                .values(following_count = following_count - 1)
            )
        
        result = session.scalars(
            select(UserAnalytics)
            .where(UserAnalytics.user_id == profile_id)
        )
        profile_user_analytics_obj = result.one_or_none()
        profile_user_id = get_id_from_username(username)
        if not profile_user_analytics_obj:
            logger.error(f"UserAnalyticsObj for user {profile_user_id} not found.")
        else:
            follower_count = active_user_analytics_obj.follower_count
            session.execute(
                update(UserAnalytics)
                .where(UserAnalytics.user_id == profile_user_id)
                .values(follower_count = follower_count - 1)
            )
        session.commit()
        return Response(
            status_code=204
        )
        
    except Exception as e:
        logger.error(f"Unable to delete a UserFollowedBy relation due to {e}")
        raise e
    
@app.get(API_PREFIX + "/fs/{file_id}")
async def get_file(file_id: str, userToken: Annotated[str, Cookie()]):
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
        
        if not file_id:
            raise HTTPException(
                status_code=401,
                detail="No file ID mentioned in the path."
            )
            
        if not os.path.exists(USER_FILES_PATH+file_id):
            raise HTTPException(
                status_code=404,
                detail="No such file found in the file system."
            )
        
        return FileResponse(
            path=USER_FILES_PATH+file_id,
            media_type="image/jpeg",
            filename="display_picture_user.jpeg"
        )
            
    except Exception as e:
        logger.error(f"Unable to serve file due to {e}")
        raise e

@app.get(API_PREFIX + "/tweet/{id}")
async def get_tweet(id: str, request: Request):
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
            
        stmt = session.query(Post, User).join(User, Post.user_id == User.id).where(Post.id == id)
        result = stmt.one_or_none()
        post_result = {**(result[1].__dict__), **(result[0].__dict__)}
        
        # Check for any previous post reference.
        post_type = result[0].post_type
        parent_post_ref = result[0].parent_post_ref
        parent_post_dict = None
        if parent_post_ref and post_type in ["quote", "retweet"]:
            parent_post_query = session.execute(
                select(Post, User)
                .join(User, Post.user_id == User.id)
                .where(Post.id == parent_post_ref)
            )
            parent_post_obj = parent_post_query.one_or_none()
            print(parent_post_obj)
            if parent_post_obj:
                parent_post_dict = {**(parent_post_obj[1].__dict__), **(parent_post_obj[0].__dict__)}
        post_result["parent_post"] = parent_post_dict
        
        return post_result
    except Exception as e:
        logger.error(f"Unable to retrieve tweet due to {e}")
        return None

# POST endpoint
@app.post(f"{API_PREFIX}/tweet", status_code=201)
async def post_tweet(
    tweet: dict, 
    request: Request,
    background_tasks: BackgroundTasks
):
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
        
        tweet_text = tweet.get("tweetText")
        if tweet_text is None:
            raise Exception('No tweetText field in the object.')
        post_type = tweet_post_type if (tweet_post_type := tweet.get("postType")) else "tweet"
        parent_post_ref = tweet_parent_id if (tweet_parent_id := tweet.get("parentPostRef")) else None
        
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
            post_type=post_type,
            parent_post_ref=parent_post_ref,
            created_on=datetime.datetime.fromisoformat(tweet_utc_timestamp),
            last_updated_on=datetime.datetime.fromisoformat(tweet_utc_timestamp)
        ))
        session.commit()
        
        post_stmt = session.query(Post, User).join(User, Post.user_id == User.id).where(Post.id == post_unique_id)
        post_in_db = post_stmt.one_or_none()
        post_dict = {**(post_in_db[1].__dict__), **(post_in_db[0].__dict__)}
        
        # Queue a job for notification
        background_tasks.add_task(create_post_notification, user, post_unique_id)
        return post_dict
        
    except Exception as e:
        logger.error(f"Unable to post tweet. due to {e}")
        


@app.on_event("startup")
async def startup():
    logger.info("🎉 Application started at port 8000 🚀")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down.")
