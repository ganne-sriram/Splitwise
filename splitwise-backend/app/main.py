from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from app.database.database import engine, Base
from app.routers import (
    auth_router, 
    users_router, 
    groups_router, 
    expenses_router, 
    settlements_router,
    analytics_router
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Splitwise API", description="A modular expense sharing application", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(groups_router)
app.include_router(expenses_router)
app.include_router(settlements_router)
app.include_router(analytics_router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Welcome to Splitwise API"}
