from fastapi import APIRouter, UploadFile, File

from typing import List
from backend.database.connectDB import product_typeDB
from backend.schema import Product_type
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/type",
    tags=["type"]
)

## Product API
@router.get("/", tags=["type"])
async def read_all_data(limit:int=1000):
    res =  product_typeDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["type"])
async def read_data(id:int):
    res =  product_typeDB().select_one(id=id)
    return res

@router.post("/", tags=["type"])
async def insert_data(product_type : Product_type):
    res =  product_typeDB().insert(name=product_type.name, type_property=product_type.type_property)
    return res

@router.put("/{id}", tags=["type"])
async def update_data(id :int, product_type : Product_type):
    res =  product_typeDB().update(id=id, name=product_type.name, type_property=product_type.type_property)
    return res

@router.delete("/{id}", tags=["type"])
async def delete_data(id :int):
    res =  product_typeDB().delete(id=id)
    return res
