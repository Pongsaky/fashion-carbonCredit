from fastapi import APIRouter, UploadFile, File

from backend.database.connectDB import userDB
from backend.schema import User, Order
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix='/user',
    tags=['user']
)

@router.get("/", tags=["user"])
async def read_all_data(limit:int=1000):
    res =  userDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["user"])
async def read_data(id:int):
    res =  userDB().select_one(id=id)
    return res

@router.post("/", tags=["user"])
async def insert_data(user : User):
    res =  userDB().insert(username=user.username, password=user.password, email=user.email, firstname=user.firstname, lastname=user.lastname, user_image=user.user_image)
    return res

@router.put("/{user_id}", tags=["user"])
async def update_data(user_id :int, user : User):
    res =  userDB().update(id=user_id, username=user.username, password=user.password, email=user.email, firstname=user.firstname, lastname=user.lastname, user_image=user.user_image)
    return res

@router.delete("/{user_id}", tags=["user"])
async def delete_data(user_id :int):
    res =  userDB().delete(id=user_id)
    return res

@router.post("/order/", tags=["user"])
async def add_product(order : Order):
    res =  userDB().order(user_id=order.user_id, product_id=order.product_id, property=order.order_property, amount=order.amount, neutral_mark=order.neutral_mark)
    return res

@router.post("/uploadfile/", tags=["user"])
async def upload_file(file :UploadFile = File(...)):
    # Single photo
    url_path = []
    upload_path =  GCStorage().upload_file(file=file)
    url_path.append(upload_path)
    return url_path