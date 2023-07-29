from fastapi import Request, Form, APIRouter, HTTPException, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from backend.database.connectDB import serviceAPI

router = APIRouter()

templates = Jinja2Templates(directory="template")

# Route for the login page
@router.get("/logout")
async def get_login_page(request :Request, response :Response):
    request.session.clear()
    return RedirectResponse(url="/login", status_code=302)
