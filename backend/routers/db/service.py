from fastapi import APIRouter, UploadFile, File

from typing import List

from backend.database.connectDB import serviceAPI, orderDB
from backend.schema import Login, User, Order, Shop, Product
from backend.utils.gcs import GCStorage

router = APIRouter(
    prefix='/service',
    tags=['service']
)

@router.get("/", tags=["service"])
async def welcome_service_api():
    return {"msg" : "Welcome to service API"}

@router.post("/login/", tags=["service"])
async def login(login : Login):
    res =  serviceAPI().login(username=login.username, password=login.password)
    return res

@router.post("/register/", tags=["service"])
async def register(user : User):
    res =  serviceAPI().register(username=user.username, password=user.password, email=user.email, firstname=user.firstname, lastname=user.lastname)
    return res

@router.post("/order/", tags=["service"])
async def add_order(order: Order):
    res =  orderDB().insert(user_id=order.user_id, product_id=order.product_id, order_property=order.order_property, amount=order.amount, neutral_mark=order.neutral_mark)
    return res

@router.post("/add-product/", tags=["service"])
async def add_product(product :Product):
    res =  serviceAPI().add_product(shop_id=product.shop_id, product_type=product.product_type, product_property=product.product_property, product_image=product.product_image)
    return res

@router.post("/add-shop/", tags=["service"])
async def add_shop(shop :Shop):
    res =  serviceAPI().add_shop(user_id=shop.user_id, name=shop.name)
    return res

@router.get("/fetch-shop/{user_id}", tags=["service"])
async def fetch_shop(user_id:int):
    res =  serviceAPI().fetch_shop(user_id=user_id)
    return res

@router.get("/fetch-other-shop/{user_id}", tags=["service"])
async def fetch_other_shop(user_id:int):
    res =  serviceAPI().fetch_other_shop(user_id=user_id)
    return res

@router.get("/fetch-other-user/{user_id}", tags=["service"])
async def fetch_other_shop(user_id:int):
    res =  serviceAPI().fetch_other_user(user_id=user_id)
    return res

@router.get("/fetch-chat/{user_id}/{user_shop_id}/{shop_id}", tags=["service"])
async def fetch_chat(user_id:int, user_shop_id:int, shop_id:int):
    res =  serviceAPI().fetch_chat(user_id=user_id, user_shop_id=user_shop_id, shop_id=shop_id)
    return res

@router.get("/fetch-product/{shop_id}", tags=["service"])
async def fetch_chat(shop_id:int):
    res =  serviceAPI().fetch_product(shop_id=shop_id)
    return res

@router.get("/fetch-order/{user_id}", tags=["service"])
async def fetch_chat(user_id:int):
    res =  serviceAPI().fetch_order(user_id=user_id)
    return res

@router.post("/fetch-checkout/", tags=["service"])
async def fetch_chat(orderList :List):
    res =  serviceAPI().fetch_chcekout(orderList=orderList)
    return res

@router.get("/fetch-historyPurchase/{user_id}", tags=["service"])
async def fetch_chat(user_id:int):
    res =  serviceAPI().fetch_historyPurchase(user_id=user_id)
    return res

@router.get("/get-co2e/{material_type}/{amount}", tags=["service"])
async def get_co2e(material_type: int, amount:int):
    return serviceAPI().get_co2e(material_type=material_type, amount=amount)

@router.post("/multi-uploadfile/", tags=["service"])
async def upload_file(files :List[UploadFile] = File(...)):
    url_path = []
    for file in files:
        upload_path =  GCStorage().upload_file(file)
        url_path.append(upload_path)
    return url_path

@router.post("/single-uploadfile/", tags=["service"])
async def upload_file(file :UploadFile = File(...)):
    upload_path =  GCStorage().upload_file(file)
    return upload_path