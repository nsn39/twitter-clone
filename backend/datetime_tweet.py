import json
import datetime
import copy

with open("./data/tweets.json", "r") as fp:
    tweets = json.load(fp)
    
print("Total no of tweets: ", len(tweets))
current_timestamp = datetime.datetime.now(datetime.UTC)
print("Current UTC Timestamp: ", current_timestamp.isoformat())

modified_tweets = []
for tweet in tweets:
    tweet_dict = copy.deepcopy(tweet)
    tweet_dict["originalTimestamp"] = str(current_timestamp.isoformat())
    modified_tweets.append(tweet_dict)
    
with open("./data/tweets2.json", "w+") as fp:
    json.dump(modified_tweets, fp)