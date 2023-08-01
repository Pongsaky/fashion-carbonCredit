from fastapi import Request, Form, APIRouter, HTTPException, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from backend.database.connectDB import serviceAPI

router = APIRouter()

templates = Jinja2Templates(directory="template")

# Route to handle login form submission
@router.post("/set-isShop")
async def set_isShop(request :Request, isShop:int, shop_id:int=-1):
    request.session["isShop"] = isShop
    request.session["shop_id"] = shop_id
    return RedirectResponse(url="/", status_code=302)
    # else : raise HTTPException(status_code=401, detail="Invalid credentials")
