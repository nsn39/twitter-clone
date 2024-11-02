from sqlalchemy import select

from db.db import session
from db.models import PostAnalytics, UserAnalytics

def get_post_analytics(post_id: str):
    result = session.scalars(
        select(PostAnalytics)
        .where(PostAnalytics.post_id == post_id)
    )
    post_analytics_obj = result.one_or_none()
    return post_analytics_obj

def get_or_create_post_analytics(post_id: str):
    post_analytics_obj = get_post_analytics(post_id)
    if not post_analytics_obj:
        session.add(
            PostAnalytics(
                post_id=post_id, 
                likes_count=0,
                retweets_count=0,
                quotes_count=0,
                replies_count=0
            )
        )
        session.commit()
        return get_post_analytics(post_id)
    return post_analytics_obj

def get_user_analytics(user_id):
    result = session.scalars(
        select(UserAnalytics)
        .where(UserAnalytics.user_id == user_id)
    )
    active_user_analytics_obj = result.one_or_none()
    return active_user_analytics_obj
    

def get_or_create_user_analytics(user_id):
    user_analytics_obj = get_user_analytics(user_id)
    if not user_analytics_obj:
        session.add(
            UserAnalytics(
                user_id=user_id,
                follower_count=0,
                following_count=0,
                posts_count=0
            )
        )
        session.commit()
        return get_user_analytics(user_id)
    return user_analytics_obj
