from fastapi import Request, Form, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="template")

# Route for the chat page
@router.get("/chat", response_class=HTMLResponse)
async def get_chat(request :Request):
    user_id = request.session.get("user_id")
    isShop = request.session.get("isShop")
    shop_id = request.session.get("shop_id")
    if isShop == 0: return templates.TemplateResponse("chat.html", {"request": request, "user_id":user_id, "isShop": isShop})
    else : return templates.TemplateResponse("chat.html", {"request": request, "user_id":user_id, "isShop": isShop, "shop_id": shop_id})