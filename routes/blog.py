from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_blog():
    return {"blogs": ["Car buying tips", "Latest car reviews"]}
