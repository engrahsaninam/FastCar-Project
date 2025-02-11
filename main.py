from fastapi import FastAPI
from routes import cars, deals, services, import_process, blog, about,auth

app = FastAPI(title="FastCar API")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(cars.router, prefix="/cars", tags=["Cars"])
app.include_router(deals.router, prefix="/best-deals", tags=["Deals"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(import_process.router, prefix="/import-process", tags=["Import Process"])
app.include_router(blog.router, prefix="/blog", tags=["Blog"])
app.include_router(about.router, prefix="/about", tags=["About"])

@app.get("/")
def home():
    return {"message": "Welcome to FastCar API"}

