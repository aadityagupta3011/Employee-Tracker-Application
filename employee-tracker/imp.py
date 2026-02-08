import time
import os
import cv2
import numpy as np
import winsound
from threading import Thread
from pynput import mouse, keyboard 
from collections import deque

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sface = cv2.FaceRecognizerSF.create(
    os.path.join(BASE_DIR, "models", "face_recognition_sface_2021dec.onnx"), ""
)
from face_embedding import get_embedding

# def get_embedding(frame):
#     box = detect_face(frame)
#     if box is None:
#         return None

#     x1,y1,x2,y2 = box
#     face = frame[y1:y2, x1:x2]
#     return sface.feature(face)

# =======================
# CONFIG
# =======================
IDLE_THRESHOLD = 10
FAKE_MOVEMENT_TIME = 5
MOVEMENT_BOX_SIZE = 15

# =======================
# GLOBALS
# =======================
last_activity_time = time.time()
active_time = 0
idle_time = 0
fake_detected = False
fake_start_time = None
mouse_positions = deque(maxlen=20)

# =======================
# LOAD FACE MODEL
# =======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
proto = os.path.join(BASE_DIR, "models", "deploy.prototxt")
model = os.path.join(BASE_DIR, "models", "res10_300x300_ssd_iter_140000.caffemodel")

net = cv2.dnn.readNetFromCaffe(proto, model)
print("✅ face detection model loaded")

# =======================
# ACTIVITY TRACKING
# =======================
last_input_time = time.time()


def on_mouse_move(x, y):
    global last_activity_time, fake_start_time, fake_detected , last_input_time
    last_activity_time = time.time()
    last_input_time = time.time()
    mouse_positions.append((x, y))

    if len(mouse_positions) == 20:
        xs = [p[0] for p in mouse_positions]
        ys = [p[1] for p in mouse_positions]

        if max(xs) - min(xs) < MOVEMENT_BOX_SIZE and max(ys) - min(ys) < MOVEMENT_BOX_SIZE:
            if fake_start_time is None:
                fake_start_time = time.time()
            elif time.time() - fake_start_time > FAKE_MOVEMENT_TIME:
                if not fake_detected:
                    print("⚠️ FAKE MOUSE MOVEMENT DETECTED")
                    winsound.Beep(400, 150)
                fake_detected = True
        else:
            fake_start_time = None
            fake_detected = False

def on_key_press(key):
    global last_activity_time , last_input_time
    last_input_time = time.time()
    last_activity_time = time.time()

def time_tracker():
    global active_time, idle_time

    while True:
        now = time.time()
        idle_duration = now - last_input_time

        if fake_detected:
            idle_time += 1

        elif idle_duration < IDLE_THRESHOLD:
            active_time += 1

        elif face_present:
            # present but not interacting → passive time
            idle_time += 1

        else:
            idle_time += 1

        print(f"Active: {active_time}s | Idle: {idle_time}s")
        time.sleep(1)

# =======================
# FACE REGISTRATION
# =======================
def detect_face(frame):
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame,(300,300)),1.0,(300,300),(104,177,123))
    net.setInput(blob)
    detections = net.forward()

    if detections[0,0,0,2] > 0.5:
        box = detections[0,0,0,3:7] * np.array([w,h,w,h])
        return box.astype("int")
    return None

def register_employee():
    cap = cv2.VideoCapture(0)
    print("Look at the camera... capturing employee")

    time.sleep(3)
    ret, frame = cap.read()

    embedding = get_embedding(frame, detect_face)
    if embedding is not None:
        np.save("employee.npy", embedding)
        print("✅ employee registered")

    cap.release()


# =======================
# FACE VERIFICATION
# =======================
face_present = False
suspect_active = False


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SUSPECT_DIR = os.path.join(BASE_DIR, "suspects")

os.makedirs(SUSPECT_DIR, exist_ok=True)

def camera_verifier():
    global face_present, suspect_active

    employee_embedding = np.load("employee.npy")
    cap = cv2.VideoCapture(0)

    print("🔍 identity verification started")

    while True:
        ret, frame = cap.read()
        live_embedding = get_embedding(frame, detect_face)

        if live_embedding is not None:
            face_present = True
            score = sface.match(employee_embedding, live_embedding,
                                cv2.FaceRecognizerSF_FR_COSINE)

            if score < 0.5:
                # Unauthorized
                if not suspect_active:     # NEW PERSON or NEW INCIDENT
                    timestamp = int(time.time())
                    cv2.imwrite( os.path.join(SUSPECT_DIR, f"suspect_{timestamp}.jpg"), frame)
                    
                    print("⚠️ UNAUTHORIZED PERSON – INCIDENT LOGGED")
                    suspect_active = True
            else:
                # Correct employee
                if suspect_active:
                    print("✅ Employee returned – incident closed")
                suspect_active = False
        else:
            face_present = False

        time.sleep(10)

# =======================
# START EVERYTHING
# =======================
print("Employee tracker started")

Thread(target=time_tracker, daemon=True).start()

register_employee()

print("Grace period: 5 minutes")
time.sleep(10)

Thread(target=camera_verifier, daemon=True).start()

with mouse.Listener(on_move=on_mouse_move) as m_listener, \
     keyboard.Listener(on_press=on_key_press) as k_listener:
    m_listener.join()
    k_listener.join()
