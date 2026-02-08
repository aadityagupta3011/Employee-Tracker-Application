import requests
import json
import os

BASE_URL = "http://localhost:5000/api"
TOKEN_FILE = "token.json"

def login(email, password):
    res = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password}
    )
    res.raise_for_status()

    token = res.json()["token"]
    with open(TOKEN_FILE, "w") as f:
        json.dump({"token": token}, f)

    return token

def get_token():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as f:
            return json.load(f)["token"]
    return None

def send_activity(data):
    token = get_token()
    if not token:
        raise Exception("Not authenticated")

    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(
        f"{BASE_URL}/agent/activity",
        json=data,
        headers=headers
    )
    res.raise_for_status()
def send_incident(image_path):
    print("🚨 send_incident called with:", image_path)

    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    with open(image_path, "rb") as img:
        files = {"image": img}
        res = requests.post(
            f"{BASE_URL}/agent/incident",
            headers=headers,
            files=files,
            timeout=25
        )

    print("📡 Response:", res.status_code, res.text)
    res.raise_for_status()
