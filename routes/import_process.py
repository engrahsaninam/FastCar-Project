from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_import_process():
    return {"import_process": "Steps to import your dream car."}
