# from connectDB import userDB, transactionDB, serviceAPI
# from datetime import datetime, timedelta, timezone
# from dotenv import load_dotenv
import os
import json
import requests
import hashlib

from backend.gcs import GCStorage

# load_dotenv()

# bod = datetime(2004, 12, 16).strftime('%Y-%m-%d %H:%M:%S')
# mydb = userDB(host="localhost", user="root", password="Pongsakon_123", database="carboncredit")
# mydb = transactionDB(host="localhost", user="root", password="Pongsakon_123", database="carboncredit")


# INSERT
# mydb.insert(username="Oakky",
#               password="123456",
#               email="pongsakon@gmail.com",
#               firstname="Pongsakon",
#               lastname="Kaewjaidee",
#               birthday=bod)

# SELECT 
# result=userDB().select_one(id=1)
# print(result)

# UPDATE
# userDB().update(id=1, password="1234")

# DELETE
# mydb.delete(id=2)

# Transfer cc
# msg = transactionDB().transfer(user_id=1, send_id=1, receive_id=3, amount=500)
# print(msg)

# Deposite cash
# msg = transactionDB().deposit_cash(user_id=1, amount=1000)
# print(msg)

# Exchange
# msg = transactionDB().exchange_cash_cc(user_id=1, amount=700 ,mode=1)
# print(msg)

# Login
# res = serviceAPI().login(username='pongsakon.kaew@gmail.com', password='1234')
# print(res)

# res=serviceAPI().send_mail(sender="pongsakon.kaew@gmail.com", recipient="pongsakon.kaew@gmail.com", password=os.getenv("password_smt"))
# print(res)

# print(json.dumps({'size' : "XL"}))

# url = "http://127.0.0.1:3000/service/uploadfile/"
# # file = {'file': open('./fashion-carbonCredit.png', 'rb')}
# files = [('files', open('./AI-profile.jpg', 'rb')), ('files', open('./CarbonCredit.png', 'rb'))]
# res = requests.post(url=url, files=files)
# print(res.json())

res = GCStorage().delete_file("f9969107c24c67d719fd89ae17be6f9ed74993eb6d29843f8e913795d4e9d248.png")
print(res)