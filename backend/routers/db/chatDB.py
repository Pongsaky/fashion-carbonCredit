from fastapi import APIRouter, UploadFile, File

from backend.database.connectDB import chatDB
from backend.schema import Chat
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

@router.get("/", tags=["chat"])
async def read_all_data(limit:int=1000):
    res =  chatDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["chat"])
async def read_data(id:int):
    res =  chatDB().select_one(id=id)
    return res

@router.post("/", tags=["chat"])
async def insert_data(chat : Chat):
    res =  chatDB().insert(user_id=chat.user_id, user_shop_id=chat.user_shop_id, shop_id=chat.shop_id, text=chat.text, isShop=chat.isShop)
    return res

@router.put("/{id}", tags=["chat"])
async def update_data(id :int, chat : Chat):
    res =  chatDB().update(id=id, user_id=chat.user_id, user_shop_id=chat.user_shop_id, shop_id=chat.shop_id, text=chat.text, isShop=chat.isShop)
    return res

@router.delete("/{id}", tags=["chat"])
async def delete_data(id :int):
    res =  chatDB().delete(id=id)
    return res
