from fastapi import APIRouter

router = APIRouter()

deals = [
    {"id": 1, "car": "Toyota Corolla", "discount": "10%"},
    {"id": 2, "car": "Honda Civic", "discount": "5%"},
]

@router.get("/")
def get_best_deals():
    return {"best_deals": deals}
