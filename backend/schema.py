from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username : str = "username"
    password : str = "password"
    email : str = "email@gmail.com"
    firstname : str = "firstname"
    lastname : str = "lastname"
    user_image : str = "https://storage.googleapis.com/carboncredit/coalla_logo.png"

class Shop(BaseModel):
    user_id : int
    name : str
    shop_image : str = "https://storage.googleapis.com/carboncredit/coalla_logo.png"

class Product(BaseModel):
    shop_id : int
    name : str
    product_type : int
    product_property : dict = {"size" : [1, 1, 1, 1, 1, 1, 1], 
                               "color" : [1, 1, 1, 1],
                               "fabric" : [1, 1],
                               "Neckline" : [1, 1, 1],
                               "sleeve-length" : [1, 1, 1],
                               "fit" : [1, 1, 1]
                               }
    description : str
    product_image : dict = {1 : "https://storage.googleapis.com/carboncredit/coalla_logo.png",
                            2 : "https://storage.googleapis.com/carboncredit/coalla_logo.png"}

class Order(BaseModel):
    user_id: int
    product_id: int
    select_property: dict = {"size" : 2, 
                               "color" : 0,
                               "fabric" : 0,
                               "feckline" : 0,
                               "sleeve-length" : 0,
                               "fit" : 1
                            }
    neutral_mark: int
    order_image : str
    status :int

class Review(BaseModel):
    user_id : int
    product_id : int
    review : int
    text : str

class Chat(BaseModel):
    user_id : int
    user_shop_id : int
    shop_id : int
    text : str
    isShop : int

class Product_type(BaseModel):
    name : str
    type_property : dict = {
    "size": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "color": [
      "Red",
      "Green",
      "Blue",
      "White"
    ],
    "fabric": [
      "Cotton",
      "Polyester",
      "Blend"
    ],
    "neckline": [
      "Crew neck",
      "V-neck",
      "Scoop neck"
    ],
    "sleeve-length": [
      "Sleeveless",
      "Short sleeves",
      "Long sleeves"
    ],
    "fit": [
      "Slim fit",
      "Regular fit",
      "Oversized"
    ]
  }

class Checkout(BaseModel):
    user_id : int
    data : dict
    product_price : int
    cc_price : int

class OrderUpdate(BaseModel):
    orderList: list
    status:int

class Login(BaseModel):
    username : str
    password : str