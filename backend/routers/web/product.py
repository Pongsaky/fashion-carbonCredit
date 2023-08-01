from fastapi import Request, Form, APIRouter, Cookie, Query, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="template")

# Route for the shop selection page
@router.get("/product", response_class=HTMLResponse)
async def get_main_page(request :Request):
    user_id = request.session.get("user_id")
    isShop = request.session.get("isShop")
    shop_id = request.session.get("shop_id")

    if isShop == 0: return templates.TemplateResponse("product.html", {"request": request, "user_id": user_id, "isShop": isShop})
    else : return templates.TemplateResponse("product.html", {"request": request, "user_id": user_id, "isShop": isShop, "shop_id" : shop_id})


