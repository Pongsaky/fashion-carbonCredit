from fastapi import Request, Form, APIRouter, Cookie, Query, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="template")

@router.get("/checkout", response_class=HTMLResponse)
async def get_main_page(request :Request):
    user_id = request.session.get("user_id")
    isShop = request.session.get("isShop")
    checkoutData = request.session.get("checkoutData")

    return templates.TemplateResponse("checkout.html", {"request": request, "user_id": user_id, "isShop" : isShop, "checkoutData": checkoutData})

# Receive data and store in session
@router.post("/checkout", response_class=HTMLResponse)
async def get_main_page(request :Request):
    data = await request.json()
    request.session["checkoutData"] = data
    return RedirectResponse(url="/checkout", status_code=200)
