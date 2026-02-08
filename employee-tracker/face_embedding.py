import os
import cv2
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sface = cv2.FaceRecognizerSF.create(
    os.path.join(BASE_DIR, "models", "face_recognition_sface_2021dec.onnx"),
    ""
)

def get_embedding(frame, detect_face_func):
    box = detect_face_func(frame)
    if box is None:
        return None

    x1, y1, x2, y2 = box
    face = frame[y1:y2, x1:x2]
    return sface.feature(face)
