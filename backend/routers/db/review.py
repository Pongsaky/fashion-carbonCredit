from fastapi import APIRouter, UploadFile, File

from backend.database.connectDB import reviewDB
from backend.schema import Review
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/review",
    tags=["review"]
)

@router.get("/", tags=["review"])
async def read_all_data(limit:int=1000):
    res =  reviewDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["review"])
async def read_data(id:int):
    res =  reviewDB().select_one(id=id)
    return res

@router.post("/", tags=["review"])
async def insert_data(review : Review):
    res =  reviewDB().insert(user_id=review.user_id, product_id=review.product_id, review=review.review, text=review.text)
    return res

@router.put("/{id}", tags=["review"])
async def update_data(id :int, review : Review):
    res =  reviewDB().update(id=id, user_id=review.user_id, product_id=review.product_id, review=review.review, text=review.text)
    return res

@router.delete("/{id}", tags=["review"])
async def delete_data(id :int):
    res =  reviewDB().delete(id=id)
    return res
