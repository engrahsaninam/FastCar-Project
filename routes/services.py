from fastapi import APIRouter

router = APIRouter()

services = {
    "finance": "We provide car financing options with low interest rates.",
    "insurance": "Get your car insured with our trusted partners."
}

@router.get("/{service_name}")
def get_service(service_name: str):
    return {"service": services.get(service_name, "Service not found")}
