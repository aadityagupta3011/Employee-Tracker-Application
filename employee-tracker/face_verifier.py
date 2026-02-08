import cv2
import numpy as np
import os
import time
from threading import Thread
from face_embedding import get_embedding
from api_client import send_incident
# =======================
# PATHS
# =======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ASSETS_DIR = os.path.join(BASE_DIR, "assets")
SUSPECT_DIR = os.path.join(BASE_DIR, "suspects")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(SUSPECT_DIR, exist_ok=True)

EMPLOYEE_FILE = os.path.join(ASSETS_DIR, "employee.npy")

# =======================
# LOAD MODELS
# =======================
proto = os.path.join(MODELS_DIR, "deploy.prototxt")
model = os.path.join(MODELS_DIR, "res10_300x300_ssd_iter_140000.caffemodel")
sface_model = os.path.join(MODELS_DIR, "face_recognition_sface_2021dec.onnx")

net = cv2.dnn.readNetFromCaffe(proto, model)
sface = cv2.FaceRecognizerSF.create(sface_model, "")

# =======================
# STATE
# =======================
face_present = False
suspect_active = False

# =======================
# FACE DETECTION
# =======================
def detect_face(frame):
    (h, w) = frame.shape[:2]

    blob = cv2.dnn.blobFromImage(
        cv2.resize(frame, (300, 300)),
        1.0,
        (300, 300),
        (104, 177, 123)
    )

    net.setInput(blob)
    detections = net.forward()

    if detections[0, 0, 0, 2] > 0.5:
        box = detections[0, 0, 0, 3:7] * np.array([w, h, w, h])
        return box.astype("int")

    return None

# =======================
# REGISTER EMPLOYEE
# =======================
def register_employee():
    cap = cv2.VideoCapture(0)
    print("📸 Look at camera… registering employee")
    time.sleep(3)

    ret, frame = cap.read()
    if not ret:
        cap.release()
        return

    embedding = get_embedding(frame, detect_face)
    if embedding is not None:
        np.save(EMPLOYEE_FILE, embedding)
        print("✅ Employee registered")

    cap.release()

# =======================
# FACE VERIFICATION LOOP
# =======================
def verify_loop():
    global face_present, suspect_active

    if not os.path.exists(EMPLOYEE_FILE):
        print("❌ No registered employee")
        return

    employee_embedding = np.load(EMPLOYEE_FILE)
    cap = cv2.VideoCapture(0)

    print("🔍 Face verification started")

    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(2)
            continue

        live_embedding = get_embedding(frame, detect_face)

        if live_embedding is not None:
            face_present = True

            score = sface.match(
                employee_embedding,
                live_embedding,
                cv2.FaceRecognizerSF_FR_COSINE
            )

            if score < 0.7:
                if not suspect_active:
                    image_path = os.path.join(
                        SUSPECT_DIR, f"suspect_{int(time.time())}.jpg"
                    )
                    cv2.imwrite(image_path,frame)
                    print("⚠️ UNAUTHORIZED PERSON — IMAGE SAVED")

                    try:
                        print("📤 Attempting incident upload...")
                        send_incident(image_path)
                        print("✅ Incident upload request sent")
                    except Exception as e:print("❌ Incident upload failed:", e)

                suspect_active = True
            else:
                if suspect_active:
                    print("✅ Employee returned")
                suspect_active = False
        else:
            face_present = False

        time.sleep(10)

# =======================
# PUBLIC API
# =======================
def start_face_verification():
    Thread(target=verify_loop, daemon=True).start()

def is_face_present():
    return face_present
