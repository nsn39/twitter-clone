import uuid
from sqlalchemy import select, update
from loguru import logger
from db.db import session
from db.models import Notifications, Post, User
from endpoints.websocket import connection_manager

async def create_like_notification(user_obj, post_id):
    logger.info(f"Background Task started for Like event of post: {post_id}")
    user_id = user_obj.id 
    
    post_obj_query = session.scalars(
        select(Post)
        .where(Post.id == post_id)
    )
    post_obj = post_obj_query.one_or_none()
    if post_obj:
        notification_id = uuid.uuid4()
        notification_obj = Notifications(
                        id=notification_id,
                        origin_user_id=user_id,
                        recipient_id=post_obj.user_id,
                        post_id=post_id,
                        event_type="like",
                        seen=False
                    )
        session.add(
            notification_obj
        )
        session.commit()
    
        # Check if user is online and send live notification.
        is_user_online = connection_manager.is_user_online(str(post_obj.user_id))
        print("is_user_online: ", is_user_online)
        if is_user_online and notification_obj:
            notification_dict = {
                "id": str(notification_id),
                "origin_user_id": str(user_id),
                "recipient_id": str(post_obj.user_id),
                "post_id": str(post_id),
                "event_type": "like",
                "seen": False
            }
            await connection_manager.send_json(str(post_obj.user_id), notification_dict)

async def create_follow_notification(user_obj, followed_profile_id):
    logger.info(f"Background task started for follow event of user: {followed_profile_id}")
    user_id = user_obj.id
    
    followed_user_obj_query = session.scalars(
        select(User)
        .where(User.id == followed_profile_id)
    )
    followed_user_obj = followed_user_obj_query.one_or_none()
    if followed_user_obj:
        notification_id = uuid.uuid4()
        notification_obj = Notifications(
                id=notification_id,
                origin_user_id=user_id,
                recipient_id=followed_profile_id,
                event_type="follow",
                seen=False
            )
        session.add(
            notification_obj
        )
        session.commit()
        
        is_user_online = connection_manager.is_user_online(str(followed_profile_id))
        if is_user_online and notification_obj:
            notification_dict = {
                "id": str(notification_id),
                "origin_user_id": str(user_id),
                "recipient_id": str(followed_profile_id),
                "event_type": "follow",
                "seen": False
            }
            await connection_manager.send_json(str(followed_profile_id), notification_dict)

async def create_post_notification(user_obj, post_id):
    logger.info(f"Background task started for new post: {post_id}")
    user_id = user_obj.id
    post_obj_query = session.scalars(
        select(Post)
        .where(Post.id == post_id)
    )
    post_obj = post_obj_query.one_or_none()
    if post_obj and post_obj.post_type in ["retweet", "quote", "reply"]:
        parent_post_id = post_obj.parent_post_ref
        parent_post_query = session.scalars(
            select(Post)
            .where(Post.id == parent_post_id)
        )
        parent_post_obj = parent_post_query.one_or_none()
        notification_id = uuid.uuid4()
        notification_obj = Notifications(
                id=notification_id,
                origin_user_id=user_id,
                recipient_id=parent_post_obj.user_id,
                post_id=post_id,
                event_type=post_obj.post_type,
                seen=False
            )
        session.add(notification_obj)
        session.commit()
        
        is_user_online = connection_manager.is_user_online(str(parent_post_obj.user_id))
        if is_user_online and notification_obj:
            notification_dict = {
                "id": str(notification_id),
                "origin_user_id": str(user_id),
                "recipient_id": str(parent_post_obj.user_id),
                "post_id": str(post_id),
                "event_type": parent_post_obj.post_type,
                "seen": False
            }
            await connection_manager.send_json(str(parent_post_obj.user_id), notification_dict)
            
            
def set_notifications_as_read(recipient_id: str):
    try:
        session.execute(
            update(Notifications)
            .where(Notifications.recipient_id == recipient_id)
            .where(Notifications.seen == False)
            .values(seen=True)
        )
        session.commit()
    except Exception as e:
        logger.error(f"Failed to update Notifications seen due to: {e}")