from fastapi import Request, Form, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="template")

# Route for the shop selection page
@router.get("/select_chat_shop", response_class=HTMLResponse)
async def get_shop_selection(request: Request):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("select_chat_shop.html", {"request" : request, "user_id": user_id})

@router.get("/add_shop", response_class=HTMLResponse)
async def get_add_shop_page(request :Request):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("add_shop.html", {"request": request, "user_id": user_id})