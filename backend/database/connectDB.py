import mysql.connector
from dotenv import load_dotenv
import os
import json

load_dotenv()

mydb = mysql.connector.connect(
        host=os.getenv("host"),
        user=os.getenv("user"),
        password=os.getenv("password"),
        database=os.getenv("database")
    )

# mydb = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="Pongsakon_123",
#         database="fashion_carboncredit"
#     )

class userDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `users` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "username", "password", "email", "firstname", "lastname", "user_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]:row_i[1], column[2]:row_i[2], column[3]:row_i[3],
                                    column[4]:row_i[4], column[5]:row_i[5], column[6]:row_i[6]}
        return result

    def select_one(self, id:int):
        result = {}
        sql = f"""SELECT * FROM `users` WHERE users.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "username", "password", "firstname", "lastname", "email", "user_image"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg" : f"Not found user_id = {id}"}
    
        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, username:str, password:str, email:str, firstname:str, lastname:str, user_image:str):
        sql = f"INSERT INTO `users` (`username`, `password`, `email`, `firstname`, `lastname`, `user_image`) VALUES ('{username}', '{password}', '{email}', '{firstname}', '{lastname}', '{user_image}');"
        print(sql)
        self.mycursor.execute(sql)
        self.mydb.commit()
        
        return {"msg": "UserDB INSERT SUCESSFULLY"}
    
    def delete(self, id:int):
        sql = f"DELETE FROM `users` WHERE users.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "UserDB DELETE SUCESSFULLY"}

    def update(self, id:int, username="", password="", email="", firstname="", lastname="", user_image=""):
        sql = f"""UPDATE `users` SET `username`='{username}', `password`='{password}', `email`='{email}', `firstname`='{firstname}', `lastname`='{lastname}', `user_image`='{user_image}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "UserDB UPDATE SUCESSFULLY"}

class shopDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = []
        sql = f"""SELECT * FROM `shops` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "name", "shop_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3]})
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `shops` WHERE shops.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "name", "shop_image"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, user_id:int, name:str, shop_image:str):
        sql = f"INSERT INTO `shops` (`user_id`, `name`, `shop_image`) VALUES ('{user_id}', '{name}', '{shop_image}');"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ShopDB INSERT SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `shops` WHERE shops.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ShopDB DELETE SUCESSFULLY"}

    def update(self, id: int, user_id="", name="", shop_image=""):
        sql = f"""UPDATE `shops` SET `user_id`='{user_id}', `name`='{name}', `shop_image`='{shop_image}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ShopDB UPDATE SUCESSFULLY"}
    
class productDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = []
        sql = f"""SELECT * FROM `products` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "shop_id", "name", "type", "property", "description", "product_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], 
                           column[3]: row_i[3], column[4]: row_i[4], column[5]: row_i[5], 
                           column[6]: row_i[6]})
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `products` WHERE products.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "shop_id", "name", "type", "property", "description", "product_image"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, shop_id:int, name:str, product_type:str, product_property:dict, description:str, product_image:dict):
        product_property = json.dumps(product_property)
        product_image = json.dumps(product_image)
        sql = f"INSERT INTO `products` (`shop_id`, `name`, `type`, `property`, `description`, `product_image`) VALUES ('{shop_id}', '{name}', '{product_type}', '{product_property}', '{description}', '{product_image}');"
        print(sql)
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ProductDB INSERT sucessfully"}
    
    def update(self, id: int, shop_id:int, name:str, product_type:str, product_property:dict, description:str, product_image:str):
        product_property = json.dumps(product_property)
        product_image = json.dumps(product_image)
        sql = f"""UPDATE `products` SET `shop_id`='{shop_id}', `name`='{name}', `type`='{product_type}', `property`='{product_property}', `description`='{description}', `product_image`='{product_image}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ProductDB UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `products` WHERE products.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ProductDB DELETE SUCESSFULLY"}

class orderDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor()

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `orders` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "serial_number", "user_id", "product_id", "select_property", "neutral_mark", "order_image", "status"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                                    column[4]: row_i[4], column[5]: row_i[5], column[6]: row_i[6],
                                    column[7]: row_i[7]}
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `orders` WHERE orders.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "serial_number", "user_id", "product_id", "select_property", "neutral_mark", "order_image", "status"]

        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, user_id:int, product_id:int, select_property:dict, neutral_mark:int, status:int, order_image:str):
        select_property = json.dumps(select_property)
        sql = f"""INSERT INTO `orders` (`user_id`, `product_id`, `select_property`, `neutral_mark`, `status`, `order_image`) 
                VALUES ('{user_id}', '{product_id}', '{select_property}', '{neutral_mark}', '{status}', '{order_image}');"""
        self.mycursor.execute(sql)
        self.mydb.commit()

        sql_select_null_serialNumber = f"""SELECT orders.id FROM orders
                                            WHERE orders.serial_number IS NULL;"""
        self.mycursor.execute(sql_select_null_serialNumber)
        row = self.mycursor.fetchone()
        result = {}
        
        result["id"] = row[0]

        order_id = result["id"]
        serial_number = serviceAPI().generate_serial_number(order_id=order_id)
        print(serial_number)

        # Update Serial number
        sql_update_serialNumber = f"""UPDATE `orders` SET `serial_number`='{serial_number}'
                WHERE `id`={order_id};"""
        
        print(sql_update_serialNumber)

        self.mycursor.execute(sql_update_serialNumber)
        self.mydb.commit()

        return {"msg": "OrderDB INSERT sucessfully"}
    
    def update(self, id: int, user_id:int, product_id:int, select_property:dict, neutral_mark:int, status:int, order_image:str):
        select_property = json.dumps(select_property)
        sql = f"""UPDATE `orders` SET `user_id`='{user_id}', `product_id`='{product_id}', `select_property`='{select_property}', `neutral_mark`='{neutral_mark}', `status`='{status}', `order_image`='{order_image}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "OrderDB UPDATE SUCESSFULLY"}
    
    def update_status(self, orderList: list, status:int):
        order_idx_str = [str(idx) for idx in orderList]

        result_string = "(" + ",".join(order_idx_str) + ")"

        sql = f"""UPDATE `orders` SET `status`='{status}'
                WHERE `id` IN {result_string};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "Status UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `orders` WHERE orders.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "OrderDB DELETE SUCESSFULLY"}

class reviewDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `reviews` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "product_id", "review", "text"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                                    column[4]: row_i[4]}
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `reviews` WHERE reviews.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "product_id", "review", "text"]

        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, user_id:int, product_id:int, review:int, text:str):
        sql = f"""INSERT INTO `reviews` (`user_id`, `product_id`, `review`, `text`) 
                VALUES ('{user_id}', '{product_id}', '{review}', '{text}');"""
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ReviewDB INSERT sucessfully"}

    def update(self, id: int, user_id="", product_id="", review="", text=""):
        sql = f"""UPDATE `reviews` SET `user_id`='{user_id}', `product_id`='{product_id}', `review`='{review}', `text`='{text}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ReviewDB UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `reviews` WHERE reviews.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ReviewDB DELETE SUCESSFULLY"}
    
class chatDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `chats` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "user_shop_id", "shop_id", "text", "isShop"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                                    column[4]: row_i[4], column[5]: row_i[5]}
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `chats` WHERE chats.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "user_shop_id", "shop_id", "text", "isShop"]

        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, user_id:int, user_shop_id:int, shop_id:int, text:str, isShop:int):
        sql = f"""INSERT INTO `chats` (`user_id`, `user_shop_id`, `shop_id`, `text`, `isShop`) 
                VALUES ('{user_id}', '{user_shop_id}', '{shop_id}', '{text}', '{isShop}');"""
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ChatDB INSERT sucessfully"}

    def update(self, id: int, user_id="", user_shop_id="", shop_id="", text="", isShop=""):
        sql = f"""UPDATE `chats` SET `user_id`='{user_id}', `user_shop_id`='{user_shop_id}', `shop_id`='{shop_id}', `text`='{text}', `isShop`='{isShop}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ChatDB UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `chats` WHERE chats.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "ChatDB DELETE SUCESSFULLY"}

class product_typeDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `product_type` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "name", "property"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]: row_i[1], column[2]: row_i[2]}
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `product_type` WHERE product_type.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "name", "property"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, name:int, type_property:dict):
        type_property = json.dumps(type_property)
        sql = f"INSERT INTO `product_type` (`name`, `property`) VALUES ('{name}', '{type_property}');"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "TypeDB INSERT SUCESSFULLY"}

    def update(self, id: int, name:str, type_property:dict):
        type_property = json.dumps(type_property)
        sql = f"""UPDATE `product_type` SET `name`='{name}', `property`='{type_property}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "TypeDB UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `product_type` WHERE product_type.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "TypeDB DELETE SUCESSFULLY"}

class checkoutDB:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def select_all(self, limit=1000):
        result = {}
        sql = f"""SELECT * FROM `checkouts` LIMIT {limit}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "data", "product_price", "cc_price"]
        row = self.mycursor.fetchall()

        for row_i in row:
            for idx, r in enumerate(row_i[:-1]):
                result[row_i[0]] = {column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3], column[4]: row_i[4]}
        return result

    def select_one(self, id: int):
        result = {}
        sql = f"""SELECT * FROM `checkouts` WHERE checkouts.id={id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "data", "product_price", "cc_price"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg": f"Not found user_id = {id}"}

        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return result

    def insert(self, user_id:int, data:dict, product_price:int, cc_price:int):
        data = json.dumps(data)
        sql = f"INSERT INTO `checkouts` (`user_id`, `data`, `product_price`, `cc_price`) VALUES ('{user_id}', '{data}', '{product_price}', '{cc_price}');"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "checkoutDB INSERT SUCESSFULLY"}

    def update(self, id: int, user_id:int, data:dict, product_price:int, cc_price:int):
        data = json.dumps(data)
        sql = f"""UPDATE `checkouts` SET `user_id`='{user_id}', `data`='{data}', `product_price`='{product_price}', `cc_price`='{cc_price}'
                WHERE `id`={id};"""

        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "checkoutDB UPDATE SUCESSFULLY"}

    def delete(self, id: int):
        sql = f"DELETE FROM `checkouts` WHERE checkouts.id={id}"
        self.mycursor.execute(sql)
        self.mydb.commit()
        return {"msg": "checkoutDB DELETE SUCESSFULLY"}

class serviceAPI:
    def __init__(self):
        self.mydb = mydb
        self.mycursor = self.mydb.cursor(buffered=True)

    def login(self, username, password):
        result = {}
        sql = f"""SELECT * FROM `users` WHERE (username='{username}' OR email='{username}') AND password='{password}'; """
        self.mycursor.execute(sql)
        column = ["id", "username", "password", "firstname", "lastname", "email", "user_image"]
        row = self.mycursor.fetchone()
        if row == None:
            return {"msg" : f"Not found username or password", "status": 0}
        for idx, r in enumerate(row[:-1]):
            result[column[idx]] = r
        return {"data": result, "status": 1}
    
    def register(self, username:str, password:str, email:str, firstname:str, lastname:str, user_image:str="https://storage.googleapis.com/carboncredit/coalla_logo.png"):
        # Check username, email or other avoid same value
        res = userDB().insert(username, password, email, firstname, lastname, user_image)
        if res["msg"] == "UserDB INSERT SUCESSFULLY":
            return {"status": 1}
        
    def order(self, serial_number:str, user_id:int, product_id:int, order_property:dict, amount:int, neutral_mark:int):
        res = orderDB().insert(user_id, product_id, order_property, amount, neutral_mark)
        if res["msg"] == "OrderDB INSERT SUCESSFULLY":
            return {"msg" : "Ordering is sucessful"}
        
    def add_product(self, shop_id:int, product_type:int, product_property:dict, product_image:str):
        res = productDB().insert(shop_id=shop_id, product_type=product_type, product_property=product_property, product_image=product_image)
        return res
        
    def add_shop(self, user_id:int, name:str, shop_image):
        res = shopDB().insert(user_id, name, shop_image)
        if res["msg"] == "ShopDB INSERT SUCESSFULLY":
            return {"msg" : "Add shop is sucessful"}
        
    def fetch_shop(self, user_id:int):
        result = []
        sql = f"""SELECT * FROM `shops` 
                RIGHT JOIN users ON shops.user_id = users.id 
                WHERE shops.user_id = {user_id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "name", "shop_image" ,"username", "user_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            # print(row_i)
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                           column[3]: row_i[3], column[4]: row_i[6], column[5]: row_i[11]})
        return result
    
    def fetch_other_shop(self, user_id:int):
        result = []
        sql = f"""SELECT * FROM `shops` WHERE NOT shops.user_id = {user_id}"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "name", "shop_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3]})
        return result
    
    def fetch_other_user(self, user_id:int):
        result = []
        sql = f"""SELECT * FROM `users` WHERE NOT users.id = {user_id}"""
        self.mycursor.execute(sql)
        column = ["id", "username", "password", "email", "firstname", "lastname", "user_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                           column[4]: row_i[4], column[5]: row_i[5], column[6]: row_i[6]})
        return result
    
    def fetch_chat(self, user_id:int, user_shop_id:int, shop_id:int):
        result = []
        sql = f"""SELECT * FROM chats 
                    WHERE user_id={user_id} AND user_shop_id={user_shop_id} AND shop_id={shop_id}
                    ORDER BY `created_at` ASC;"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "user_shop_id", "shop_id", "text", "isShop"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], column[3]: row_i[3],
                           column[4]: row_i[4], column[5]: row_i[5]})
        return result
    
    def fetch_product(self, shop_id:int):
        result = []
        sql = f"""SELECT * FROM products 
                    WHERE shop_id={shop_id};"""
        self.mycursor.execute(sql)
        column = ["id", "shop_id", "name", "type", "property", "description", "product_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            # for idx, r in enumerate(row_i[:-1]):
            result.append({column[0]: row_i[0], column[1]: row_i[1], column[2]: row_i[2], 
                           column[3]: row_i[3], column[4]: row_i[4], column[5]: row_i[5], 
                           column[6]: row_i[6]})
            
        return result
    
    def fetch_order(self, user_id:int):
        result = []
        sql = f"""SELECT orders.id, orders.product_id, orders.select_property, orders.neutral_mark, 
                    orders.status, products.shop_id, shops.name, products.name, products.product_image, orders.order_image  FROM orders 
                    RIGHT JOIN products
                    ON orders.product_id = products.id
                    LEFT JOIN shops
                    ON products.shop_id = shops.id
                    WHERE orders.user_id = {user_id} AND orders.status=0
                    ORDER BY orders.created_at DESC, orders.product_id ASC;"""
        self.mycursor.execute(sql)
        column = ["id", "product_id", "select_property", "neutral_mark", "status", "shop_id", "shop_name", "product_name", "product_image", "order_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            obj = {}
            for idx, col in enumerate(column):
                obj[col] = row_i[idx]

            result.append(obj)
    
        return result
    
    def fetch_chcekout(self, orderList:list):
        result = []
        order_idx_str = [str(idx) for idx in orderList]

        result_string = "(" + ",".join(order_idx_str) + ")"

        sql = f"""SELECT orders.id, orders.product_id, orders.select_property, orders.neutral_mark, 
                    orders.status, products.shop_id, shops.name, products.name, products.product_image, orders.order_image FROM orders
                RIGHT JOIN products
                ON orders.product_id = products.id
                LEFT JOIN shops
                ON products.shop_id = shops.id
                WHERE orders.id IN {result_string}
                ORDER BY orders.created_at DESC, orders.product_id ASC ;"""
        self.mycursor.execute(sql)
        column = ["id", "product_id", "select_property", "neutral_mark", "status", "shop_id", "shop_name", "product_name", "product_image", "order_image"]
        row = self.mycursor.fetchall()

        for row_i in row:
            obj = {}
            for idx, col in enumerate(column):
                obj[col] = row_i[idx]

            result.append(obj)
    
        return result

    def fetch_historyPurchase(self, user_id:int):
        result = []

        sql = f"""SELECT * FROM checkouts
                WHERE checkouts.user_id ={user_id}
                ORDER BY checkouts.created_at DESC;"""
        self.mycursor.execute(sql)
        column = ["id", "user_id", "data", "product_price", "cc_price"]
        row = self.mycursor.fetchall()

        for row_i in row:
            obj = {}
            for idx, col in enumerate(column):
                obj[col] = row_i[idx]

            result.append(obj)
    
        return result

    def get_co2e(self, material_type:int, amount:int):
        """
        0 -> Cotton
        1 -> Polyester
        """
        co2e_material = {"0": 6, "1": 11.7} # Co2e Kg unit

        return amount * co2e_material[str(material_type)]

    def generate_serial_number(self, order_id):
        import hashlib

        usedSerialNumbers = set()
        # Fetch order serial-number
        sql = f"""SELECT orders.serial_number FROM orders"""
        self.mycursor.execute(sql)
        result = self.mycursor.fetchall()
        
        for r in result:
            usedSerialNumbers.add(r[0])

        print(usedSerialNumbers)

        # Use SHA-256 hash function to create the serial number
        hash_object = hashlib.sha256(str(order_id).encode())
        serial_number = 'CL-' + hash_object.hexdigest()[:6]

        # Check if the serial number is already used, if not, add it to the set and return it
        if serial_number not in usedSerialNumbers:
            return serial_number   
            
    def checkSerialNumberIsNetZero(self, serial_number:str):
        sql = f""" SELECT orders.neutral_mark FROM orders WHERE `serial_number`='{serial_number}' """
        self.mycursor.execute(sql)
        isNetZero = self.mycursor.fetchone()
        return isNetZero[0]
