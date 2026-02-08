import time
from activity_tracker import start_activity_tracking
from face_verifier import register_employee, start_face_verification, is_face_present
from app_tracker import start_app_tracking, get_app_usage
from api_client import login, send_activity
from activity_tracker import get_times


print("🚀 Employee monitoring agent started")

start_activity_tracking(is_face_present)

start_app_tracking(
    is_face_present_func=is_face_present,
    is_user_idle_func=lambda: False  # replace later if needed
)

register_employee()
print("⏳ 5-minute grace period")
time.sleep(20)

start_face_verification()
login("aaditya@company.com", "emp123")

last_active = 0
last_idle = 0
last_sent = time.time()

while True:
    time.sleep(10)

    print("\n📊 App usage summary:")
    for app, seconds in get_app_usage().items():
        print(f"  {app} → {int(seconds)} sec")

    if time.time() - last_sent >= 15:

        current_active, current_idle = get_times()

        send_activity({
            "active": current_active - last_active,
            "idle": current_idle - last_idle,
            "passive": 0,
            "fakeMouse": False,
            "appUsage": get_app_usage()
        })

        print("📡 Activity sent to backend")

        last_active = current_active
        last_idle = current_idle
        last_sent = time.time()