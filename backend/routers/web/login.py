from fastapi import Request, Form, APIRouter, HTTPException, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from backend.database.connectDB import serviceAPI

router = APIRouter()

templates = Jinja2Templates(directory="template")

# Route for the login page
@router.get("/login", response_class=HTMLResponse)
async def get_login_page(request :Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Route to handle login form submission
@router.post("/login")
async def login(request :Request, response: Response, username: str = Form(...), password: str = Form(...)):
    # Check username and password (you can implement your authentication logic here)
    # For simplicity, let's assume the username and password are valid
    # In a real-world application, you should validate the credentials against a database
    res = serviceAPI().login(username=username, password=password)
    print(res)
    if res['status'] == 1:
        # Set the user_id in the session
        # user_id = secrets.token_hex(16)  # Generate a random user_id
        # request.session["user_id"] = res['data']['id']
        user_id = res['data']['id']
        request.session["user_id"] = user_id
        request.session["firstname"] = res['data']['firstname']
        request.session["lastname"] = res['data']['lastname']

        return RedirectResponse(url="/main", status_code=302)
    else : raise HTTPException(status_code=401, detail="Invalid credentials")
