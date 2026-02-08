import time
import win32gui
import win32process
import psutil
from threading import Thread

# =======================
# CONFIG
# =======================
TRACK_INTERVAL = 2  # seconds

# simple classification rules
PRODUCTIVE_APPS = ["code.exe", "pycharm", "idea", "notepad", "sublime_text"]
DISTRACTING_KEYWORDS = ["youtube", "netflix", "prime video", "hotstar", "instagram"]

# =======================
# STATE
# =======================
app_usage = {}  # { app_name: seconds }
last_app = None
last_switch_time = time.time()

# dependency injections
_is_face_present = None
_is_user_idle = None


# =======================
# HELPERS
# =======================
def get_active_app():
    try:
        hwnd = win32gui.GetForegroundWindow()
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        process = psutil.Process(pid)

        app_name = process.name().lower()
        title = win32gui.GetWindowText(hwnd).lower()

        return app_name, title
    except:
        return None, None


def classify_app(app_name, title):
    for app in PRODUCTIVE_APPS:
        if app in app_name:
            return "productive"

    for keyword in DISTRACTING_KEYWORDS:
        if keyword in title:
            return "distracting"

    return "neutral"


# =======================
# TRACKING LOOP
# =======================
def track_loop():
    global last_app, last_switch_time

    while True:
        # pause tracking if user idle or face not present
        if _is_user_idle and _is_user_idle():
            time.sleep(TRACK_INTERVAL)
            continue

        if _is_face_present and not _is_face_present():
            time.sleep(TRACK_INTERVAL)
            continue

        app_name, title = get_active_app()
        now = time.time()

        if app_name is None:
            time.sleep(TRACK_INTERVAL)
            continue

        if last_app is None:
            last_app = (app_name, title)
            last_switch_time = now

        elif (app_name, title) != last_app:
            elapsed = now - last_switch_time

            category = classify_app(last_app[0], last_app[1])
            key = f"{last_app[0]} ({category})"

            app_usage[key] = app_usage.get(key, 0) + elapsed

            last_app = (app_name, title)
            last_switch_time = now

        time.sleep(TRACK_INTERVAL)


# =======================
# PUBLIC API
# =======================
def start_app_tracking(is_face_present_func=None, is_user_idle_func=None):
    global _is_face_present, _is_user_idle
    _is_face_present = is_face_present_func
    _is_user_idle = is_user_idle_func

    Thread(target=track_loop, daemon=True).start()


def get_app_usage():
    return app_usage
