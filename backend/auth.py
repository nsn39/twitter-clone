from datetime import timedelta, datetime, timezone, date
from typing import Annotated
import uuid
from uuid import UUID

from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Form, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy import select
from loguru import logger

from db.models import User
from db.db import session

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: str | None
    
class UserSchema(BaseModel):
    username: str
    email: str
    fullname: str
    disabled: bool = False
    
class UserInDB(UserSchema):
    id: UUID
    phone_no:str
    birth_day:int
    birth_month:int
    birth_year:int
    gender:str
    hashed_password:str
    country:str
    profile_pic_filename: str | None = None
    bio_text: str | None = None
    location: str | None = None
    website: str | None = None
    
class RegistrationForm(BaseModel):
    username: str | None = None
    password: str | None = None
    email:str | None = None
    full_name:str | None = None
    phone_no:str | None = None
    birth_day:str | None = None
    birth_month:str | None = None
    birth_year:str | None = None
    gender:str | None = None
    country:str | None = None
    
class LoginForm(BaseModel):
    username: str | None = None
    password: str | None = None
    phone_no: str | None = None
    email_address: str | None = None
    
month_to_int = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                "July": 7, "August": 8, "September": 9, "October": 10, "November": 11,
                "December": 12}
    

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    '''
    with open('data/user.json', "r") as fp:
        fake_db = json.loads(fp.read())
        
    username_to_idx = {item["username"]: i for i, item in enumerate(fake_db)}
    usernames = [item["username"] for item in fake_db]
    
    if username in usernames:
        user_dict = fake_db[username_to_idx[username]]
        return UserInDB(**user_dict)
    '''
    try:
        user_query = session.scalars(select(User).where(User.username == username))
        user_query_result = user_query.one_or_none()
        if user_query_result:
            user_dict = user_query_result.__dict__
            user_dict["birth_day"] = user_dict["birthdate"].day
            user_dict["birth_month"] = user_dict["birthdate"].month
            user_dict["birth_year"] = user_dict["birthdate"].year
            del user_dict["birthdate"]
            del user_dict["_sa_instance_state"]
            # last_updated_on, last_created_on ignored for now.
            #print(type(user_dict["birthdate"]))
            #print("user dict received: ", user_dict)
            return UserInDB(**(user_dict))
        else:
            raise HTTPException(
                status_code=401,
                detail="User not found."
            )
    except Exception as e:
        logger.error("No entry for profile found in DB.")
        raise e
    
def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=5)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user 

async def get_current_active_user(
    current_user: Annotated[UserSchema, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user.")
    return current_user

@router.post("/login", status_code=200)
async def login_for_access_token(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    try:
        user = authenticate_user(username, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        user_info = {
            "user": user.username,
            "full_name": user.fullname
        }
        response = JSONResponse(content=user_info)
        # secure False and samesite lax was working before.
        # secure True samesite none for local; secure False samesite strict for prod.
        response.set_cookie(
            key="userToken",
            value=access_token,
            domain="localhost",
            secure=True, 
            httponly=True,
            max_age=400000,
            samesite="none",
        )
        return response
    except Exception as e:
        logger.error(f"Unable to login due to: {e}")
        session.rollback()
        raise e

@router.post("/signup", status_code=201)
async def signup_for_access_token(
    username: Annotated[str, Form()],
    email: Annotated[str, Form()],
    full_name: Annotated[str, Form()],
    phone_no: Annotated[str, Form()],
    birth_day: Annotated[str, Form()],
    birth_month: Annotated[str, Form()],
    birth_year: Annotated[str, Form()],
    gender: Annotated[str, Form()],
    password: Annotated[str, Form()],
    country: Annotated[str, Form()],
    response: Response
):
    try:
        user_obj = UserInDB(
            id=uuid.uuid4(),
            username=username,
            email=email,
            fullname=full_name,
            phone_no=phone_no,
            birth_day=int(birth_day),
            birth_month=month_to_int[birth_month],
            birth_year=int(birth_year),
            gender=gender,
            hashed_password=get_password_hash(password),
            country=country
        )
        '''
        with open("data/user.json", "r") as fp:
            users = json.loads(fp.read())
            
        # check if the user already exists before adding.
        
        with open("data/user.json", "w") as fp:
            users.append(user_obj.model_dump())
            json.dump(users, fp)
        '''
        session.add(User(
            id=user_obj.id,
            fullname=user_obj.fullname,
            username=user_obj.username,
            birthdate=date(user_obj.birth_year, user_obj.birth_month, user_obj.birth_day),
            gender=user_obj.gender,
            country=user_obj.country,
            hashed_password=user_obj.hashed_password,
            email=user_obj.email,
            phone_no=user_obj.phone_no
        ))
        session.commit()
        
        # create and return a token.
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_obj.username}, expires_delta=access_token_expires
        )
        # set the client cookie
        user_info = {
            "user": user_obj.username,
            "full_name": user_obj.fullname
        }
        response = JSONResponse(content=user_info)
        response.status_code = 201
        response.set_cookie(
            key="userToken",
            value=access_token,
            domain="localhost",
            secure=False,
            httponly=True,
            max_age=400000,
            samesite="lax", #lax,strict
        )
        return response
    except Exception as e:
        logger.error(f"Unable to create a new User due to: {e}")
        session.rollback()
        raise e
    
@router.get("/check_session", status_code=200)
async def check_user_session(request: Request):
    try:
        cookies = request.cookies
        user_token = cookies.get("userToken")

        if not user_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authetication cookie not found in client.",
            )
        else:
            user = await get_current_user(token=user_token)
            return {
                "username": user.username,
                "msg": "User session currently active."
            }
    except Exception as e:
        logger.error(f"Unable to check session due to: {e}")
        session.rollback()
        raise e

@router.get("/logout", status_code=204)
async def logout_user(request: Request, response: Response):
    try:
        if "userToken" in request.cookies:
            response.delete_cookie(
                key="userToken",
                domain="localhost",
                httponly=True,
                samesite="lax"
            )
            return {
                "msg": "successfully logged out."
            }
        return {
            "msg": "User not logged in."
        }
    except Exception as e:
        logger.error(f"Unable to logout user due to: {e}")
        session.rollback()
        raise e
    
'''
#TODO:
    Go to frontend:
    
    signup button show add a new user.
    
    login button should set a cookie, if not successful, show the message in frontend
    if successful, redirect to /home. 
    
    make the lower-left part display the username by decoding the token and fetching username
    from user.json
    
    protect the dashboard and all other pages from unauthorized access.
    
    then declare all the db models for post, user, add migration files.
    
    show only the posts uploaded by the user in their profiles.
    
    initialized git and upload to github.
    
    add two containers for database and nginx using docker-compose and disable cross-cookies.
'''
