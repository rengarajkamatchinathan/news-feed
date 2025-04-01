from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from typing import List

# Initialize FastAPI app
app = FastAPI()

# MongoDB client setup (replace with your actual MongoDB URI)
print("Connecting to MongoDB at mongodb://localhost:27017")
client = MongoClient("mongodb://news-db:27017")
db = client["news_db"]  # Database name
collection = db["news_articles"]  # Collection name

# Pydantic model to validate incoming news data
class NewsArticle(BaseModel):
    title: str
    content: str
    author: str
    published_date: datetime

# Helper function to convert MongoDB ObjectId to string
def str_object_id(article):
    article["_id"] = str(article["_id"])
    return article

# Route to get a simple string response
@app.get("/")
async def root():
    return "news api"

# Route to get all news articles
@app.get("/news", response_model=List[NewsArticle])
async def get_all_news():
    try:
        print("Fetching all news articles from MongoDB")
        articles = list(collection.find())
        print(f"Found {len(articles)} articles")
        return [str_object_id(article) for article in articles]
    except Exception as e:
        print(f"Error fetching news articles: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Route to create a new news article
@app.post("/news", response_model=NewsArticle)
async def create_news(article: NewsArticle):
    try:
        print(f"Creating a new news article: {article.title}")
        article_dict = article.dict()
        article_dict["published_date"] = article_dict["published_date"].isoformat()  # Ensure the date is in ISO format
        
        print(f"Inserting article into MongoDB: {article_dict}")
        result = collection.insert_one(article_dict)
        article_dict["_id"] = str(result.inserted_id)  # Add the generated MongoDB ObjectId as a string
        
        print(f"Article '{article.title}' inserted with ID: {article_dict['_id']}")
        return article_dict
    except Exception as e:
        print(f"Error creating news article: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
