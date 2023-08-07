from fastapi import APIRouter, UploadFile, File

from typing import List
from backend.database.connectDB import checkoutDB
from backend.schema import Checkout
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/checkout",
    tags=["checkout"]
)

## Product API
@router.get("/", tags=["type"])
async def read_all_data(limit:int=1000):
    res =  checkoutDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["type"])
async def read_data(id:int):
    res =  checkoutDB().select_one(id=id)
    return res

@router.post("/", tags=["type"])
async def insert_data(checkout : Checkout):
    res =  checkoutDB().insert(user_id=checkout.user_id, data=checkout.data, product_price=checkout.product_price, cc_price=checkout.cc_price)
    return res

@router.put("/{id}", tags=["type"])
async def update_data(id :int, checkout : Checkout):
    res =  checkoutDB().update(id=id, user_id=checkout.user_id, data=checkout.data, product_price=checkout.product_price, cc_price=checkout.cc_price)
    return res

@router.delete("/{id}", tags=["type"])
async def delete_data(id :int):
    res =  checkoutDB().delete(id=id)
    return res
