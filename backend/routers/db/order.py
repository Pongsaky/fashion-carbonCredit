from fastapi import APIRouter, UploadFile, File

from backend.database.connectDB import orderDB
from backend.schema import Order, OrderUpdate
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix="/order",
    tags=["order"]
)

## Order API
@router.get("/", tags=["order"])
async def read_all_data(limit:int=1000):
    res =  orderDB().select_all(limit=limit)
    return res

@router.get("/{id}", tags=["order"])
async def read_data(id:int):
    res =  orderDB().select_one(id=id)
    return res

@router.post("/", tags=["order"])
async def insert_data(order : Order):
    res =  orderDB().insert(user_id=order.user_id, product_id=order.product_id, select_property=order.select_property, neutral_mark=order.neutral_mark, order_image=order.order_image, status=order.status)
    return res

@router.put("/{id}", tags=["order"])
async def update_data(id :int, order : Order):
    res =  orderDB().update(id=id, user_id=order.user_id, product_id=order.product_id, select_property=order.select_property, neutral_mark=order.neutral_mark, order_image=order.order_image, status=order.status)
    return res

@router.put("/update_status/", tags=["order"])
async def update_data(orderupdate: OrderUpdate):
    res =  orderDB().update_status(orderList=orderupdate.orderList, status=orderupdate.status)
    return res

@router.delete("/{id}", tags=["order"])
async def delete_data(id :int):
    res =  orderDB().delete(id=id)
    return res

