from fastapi import APIRouter, UploadFile, File

from backend.database.connectDB import shopDB
from backend.schema import Shop
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/shop",
    tags=["shop"]
)

## Shop APIS
@router.get("/", tags=["shop"])
async def read_all_data(limit:int=1000):
    res =  shopDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["shop"])
async def read_data(id:int):
    res =  shopDB().select_one(id=id)
    return res

@router.post("/", tags=["shop"])
async def insert_data(shop : Shop):
    res =  shopDB().insert(user_id=shop.user_id, name=shop.name, shop_image=shop.shop_image)
    return res

@router.put("/{id}", tags=["shop"])
async def update_data(id :int, shop : Shop):
    res =  shopDB().update(id=id, user_id=shop.user_id, name=shop.name, shop_image=shop.shop_image)
    return res

@router.delete("/{id}", tags=["shop"])
async def delete_data(id :int):
    res =  shopDB().delete(id=id)
    return res

@router.post("/uploadfile/", tags=["shop"])
async def upload_file(file :UploadFile = File(...)):
    # Single photo
    url_path = []
    upload_path =  GCStorage().upload_file(file=file)
    url_path.append(upload_path)
    return url_path