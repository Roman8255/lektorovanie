from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn

app: FastAPI = FastAPI()
templates = Jinja2Templates(directory="templates")


@app.get("/stranka", response_class=HTMLResponse)
def stranka(request: Request):
    return templates.TemplateResponse(request, "stranka.html")


@app.get("/")
def root():
    return {
        "message": "Hello world",
        "nova": "Toto je nova sprava",
    }




@app.get("/test/1")
def test():
    return {"message": "This is a test endpoint"}

@app.get("/test/2")
def test1():
    return {"message": "Hahahah hehehe"}

@app.get("/roman")
def roman():
    return {"message": "Roman Bednárik"}

@app.post("/echo")
async def echo(request: Request):
    body = await request.json()
    return {"my_answer": body["input"],
            "moje_jmeno": body["meno"]}
    
@app.post("/scitanie")
async def scitanie(request: Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] + body["druhe_cislo"]}

@app.get("/scitanie/{prve_cislo}/{druhe_cislo}")
async def scitanie(prve_cislo: int, druhe_cislo: int):
    return {"vysledok": prve_cislo + druhe_cislo}

@app.post("/spojenie")
async def spojenie(request: Request):
    body = await request.json()
    return {"vysledok": body["meno"] + " " + body["priezvisko"]}

@app.get("/spojenie/{meno}/{priezvisko}")
async def spojenie(meno: str, priezvisko: str):
    return {"vysledok": meno + " " + priezvisko}

@app.post("/login")
async def login(request: Request):
    body = await request.json()
    if body["username"] == "admin" and body["password"] == "admin_password":
        return {"message": "Login successful",
                "user": body["username"]}
    else:
        return {"message": "Invalid credentials"}

@app.post("/login_demo")
async def login_demo(request: Request):
    body = await request.json()
    username = body.get("username")
    password = body.get("password")
    if username == "admin" and password == "admin_password":
        return {"message": "Login successful",
                "user": username}
    else:
        return {"message": "Invalid credentials"}



@app.get("/user/{user_id}")
def get_user(user_id: str) -> dict[str, Any]:
    try:
        return {
            "user_id": user_id,
            "name": f"User {user_id}",
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8010,
        reload=True,
    )