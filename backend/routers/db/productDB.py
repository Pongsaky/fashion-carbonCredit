from fastapi import APIRouter, UploadFile, File

from typing import List
from backend.database.connectDB import productDB
from backend.schema import Product
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/product",
    tags=["product"]
)

## Product API
@router.get("/", tags=["product"])
async def read_all_data(limit:int=1000):
    res = productDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["product"])
async def read_data(id:int):
    res = productDB().select_one(id=id)
    return res

@router.post("/", tags=["product"])
async def insert_data(product : Product):
    res =  productDB().insert(shop_id=product.shop_id, name=product.name, product_type=product.product_type, product_property=product.product_property, description=product.description, product_image=product.product_image)
    return res

@router.put("/{id}", tags=["product"])
async def update_data(id :int, product : Product):
    res =  productDB().update(id=id, shop_id=product.shop_id, name=product.name, product_type=product.product_type, product_property=product.product_property, description=product.description, product_image=product.product_image)
    return res

@router.delete("/{id}", tags=["product"])
async def delete_data(id :int):
    res =  productDB().delete(id=id)
    return res

@router.post("/uploadfile/", tags=["product"])
async def upload_file(files :List[UploadFile] = File(...)):
    # Many photo
    url_path = []
    for file in files:
        upload_path =  GCStorage().upload_file(file=file)
        url_path.append(upload_path)
    return url_path