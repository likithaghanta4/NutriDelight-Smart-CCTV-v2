from flask import Flask, Response
import cv2
import threading

_latest_frame = None
_lock = threading.Lock()


def set_frame(frame):
    global _latest_frame
    with _lock:
        _latest_frame = frame.copy()


def get_frame():
    with _lock:
        if _latest_frame is None:
            return None
        return _latest_frame.copy()


app = Flask(__name__)


def generate_frames():
    while True:
        frame = get_frame()

        if frame is None:
            continue

        _, buffer = cv2.imencode(".jpg", frame)

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )


@app.route("/video-feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


def start_stream_server():
    threading.Thread(
        target=lambda: app.run(
            host="0.0.0.0",
            port=5001,
            threaded=True,
            debug=False,
            use_reloader=False,
        ),
        daemon=True,
    ).start()