from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def about():
    return {"about": "FastCar - Your trusted car marketplace."}
