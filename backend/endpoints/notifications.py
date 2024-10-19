from typing import Annotated

from fastapi import APIRouter, Cookie, HTTPException, status, BackgroundTasks
from loguru import logger
from sqlalchemy import select

from db.models import Notifications, Post, User
from db.db import session
from auth import get_current_user
from tasks.notifications import set_notifications_as_read

router = APIRouter()

@router.get("/unseen_notifications_count", status_code=200)
async def get_new_notifications_count(
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
        
        count_query = session.scalars(
            select(Notifications)
            .where(Notifications.recipient_id == user.id)
            .where(Notifications.seen == False)
        )    
        count_query_result = count_query.fetchall()
        unseen_messages_count = len(count_query_result)
        return {
            "count": unseen_messages_count
        }
        
    except Exception as e:
        logger.error(f"Unable to get notification count due to: {e}")
        raise e

@router.get("/notifications", status_code=200)
async def get_notifications(
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
        
        notifications_query = session.execute(
            select(Notifications, User)
            .join(User, Notifications.origin_user_id == User.id)
            .where(Notifications.recipient_id == user.id)
            .order_by(Notifications.created_on.desc())
        )
        notifications_list = notifications_query.fetchall()
        #print(notifications_list)
        #print(type[notifications_list[0]])
        if notifications_list:
            notifications_list = [{**(notification[0].__dict__), **(notification[1].__dict__)}  for notification in notifications_list]
            background_tasks.add_task(set_notifications_as_read, str(user.id))
            return notifications_list
        
    except Exception as e:
        logger.error(f"Unable to fetch notifications due to: {e}")
        raise e