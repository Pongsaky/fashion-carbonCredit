from fastapi import Request, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="template")

# Route for the shop selection page
@router.get("/dashboard", response_class=HTMLResponse)
async def get_dashboard(request :Request):
    user_id = request.session.get("user_id")
    isShop = request.session.get("isShop")
    shop_id = request.session.get("shop_id")

    # if user_id is None:
    #     # If user is not authenticated, redirect to the login page
    #     return RedirectResponse(url="/login", status_code=302)
    # if isShop == 0: return templates.TemplateResponse("edit-profile.html", {"request": request, "user_id": user_id, "isShop": isShop})
    return templates.TemplateResponse("dashboard.html", {"request": request, "user_id": user_id, "isShop": isShop, "shop_id": shop_id})