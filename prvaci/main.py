from typing import Any

from fastapi import FastAPI, Request
import uvicorn

app: FastAPI = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello world"}


@app.get("/test/1")
def test():
    return {"message": "This is a test endpoint"}

@app.get("/test/2")
def test1():
    return {"message": "Hahahah hehehe"}


@app.get("/user/{user_id}")
def get_user(user_id: int) -> dict[str, Any]:
    try:
        return {
            "user_id": user_id,
            "name": f"User {user_id}",
        }
    except Exception as e:
        return {"error": str(e)}

@app.post('/echo')          
async def echo(request:Request):
    body = await request.json()
    return {"my_answer": body["input"],
            "moje_meno": body["meno"]}

@app.post('/scitanie')
async def scitanie(request:Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] + body["druhe_cislo"]}


@app.post('/odcitanie')
async def odcitanie(request:Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] - body["druhe_cislo"]}

@app.post('/nasobenie')
async def nasobenie(request:Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] * body["druhe_cislo"]}

@app.post('/delenie')
async def delenie(request:Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] / body["druhe_cislo"]}


@app.get('/scitanie/5/10')
async def scitanie(request:Request):
    body = await request.json()
    return {"vysledok": body["prve_cislo"] + body["druhe_cislo"]}

@app.post('/spojenie')
async def spojenie(request:Request):
    body = await request.json()
    return {"vysledok": body["meno"] + " " + body["priezvisko"]}

@app.post('/log_in ')
async def log_in(request:Request):
    body = await request.json()
    if body["username"] == "admin" and body["password"] == "admin":
        return {"message": "Login successful"}
    else:
        return {"message": "Invalid username or password"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )