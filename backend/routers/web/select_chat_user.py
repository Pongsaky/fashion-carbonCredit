from fastapi import Request, Form, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="template")

# Route for the shop selection page
@router.get("/select_chat_user", response_class=HTMLResponse)
async def get_shop_selection(request: Request):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("select_chat_user.html", {"request" : request, "user_id": user_id})