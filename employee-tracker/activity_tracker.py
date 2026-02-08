import time
import winsound
from collections import deque
from threading import Thread
from pynput import mouse, keyboard

IDLE_THRESHOLD = 10
FAKE_MOVEMENT_TIME = 5
MOVEMENT_BOX_SIZE = 15

last_input_time = time.time()
active_time = 0
idle_time = 0

fake_detected = False
fake_start_time = None
mouse_positions = deque(maxlen=20)

_is_face_present = None


def on_mouse_move(x, y):
    global last_input_time, fake_start_time, fake_detected

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
                    winsound.Beep(400, 150)
                fake_detected = True
        else:
            fake_start_time = None
            fake_detected = False


def on_key_press(key):
    global last_input_time
    last_input_time = time.time()


def time_tracker():
    global active_time, idle_time

    while True:
        idle_duration = time.time() - last_input_time

        if fake_detected:
            idle_time += 1
        elif idle_duration < IDLE_THRESHOLD:
            active_time += 1
        else:
            idle_time += 1

        print(f"Active: {active_time}s | Idle: {idle_time}s")
        time.sleep(1)


def start_activity_tracking(is_face_present_func):
    global _is_face_present
    _is_face_present = is_face_present_func

    Thread(target=time_tracker, daemon=True).start()
    mouse.Listener(on_move=on_mouse_move).start()
    keyboard.Listener(on_press=on_key_press).start()

def get_times():
    return active_time, idle_time
