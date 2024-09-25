from backend.db.db import session, Base, engine, User, Post
import uuid
import datetime
import json

def init_db():
    # Create all the tables
    '''
    Base.metadata.create_all(engine)
    
    session.add(User(
        id=uuid.uuid4(),
        fullname="Nishan Poudel",
        username="ooshaaan",
        birthdate=datetime.date(2000, 8, 31),
        gender="male",
        country="Nepal",
        hashed_password="random",
        email="nishan@gmail.com",
        phone_no="9845908448"
    ))
    
    session.add(Post(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        content="Just setting up my twttr."
    ))
    '''
    
    with open("data/tweets.json", "r") as fp:
        tweets = json.loads(fp.read())
        for tweet in tweets:
            session.add(Post(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                content=tweet["tweetText"]
            ))
    
    session.commit()
    
if __name__=="__main__":
    init_db()
