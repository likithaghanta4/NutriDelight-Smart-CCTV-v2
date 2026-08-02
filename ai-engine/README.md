# NutriDelight Smart CCTV Analytics - AI Engine

This folder contains the standalone AI Engine for Module 1 of NutriDelight Smart CCTV Analytics.

## What this module does

The AI Engine reads a live video source, runs YOLOv11 object detection, and overlays live object counts on the video frame.

Supported sources:
- Webcam
- Local video file
- RTSP IP CCTV camera

Detected classes:
- Person
- Car
- Motorcycle
- Bus
- Truck

## File Purpose

- `main.py`: Command-line entry point. Starts the AI Engine with `python main.py`.
- `config/settings.py`: Shared configuration defaults and class mappings.
- `src/app.py`: Orchestrates the full inference loop.
- `src/detector.py`: Loads YOLOv11 and returns structured detections.
- `src/video_source.py`: Threaded video capture for webcam, file, and RTSP sources.
- `utils/source_utils.py`: Resolves the user input source into a usable video source.
- `utils/performance.py`: Simple FPS tracker.
- `utils/visualization.py`: Draws boxes, labels, counts, and status overlays.
- `requirements.txt`: Python dependencies for the module.
- `models/`: Place custom model files here if you want to use a local YOLOv11 weight file.
- `outputs/`: Optional output directory for future recordings or exported artifacts.

## Run

Set optional environment variables if you want to override the backend target or camera label. In PowerShell:

```bash
$env:BACKEND_DETECTIONS_URL = "http://localhost:5000/api/detections"
$env:CAMERA_NAME = "NutriDelight Camera 1"
```

Then start the AI engine:

```bash
pip install -r requirements.txt
python main.py
```

Example custom sources:

```bash
python main.py --source 0
python main.py --source "sample_video.mp4"
python main.py --source "rtsp://username:password@camera-ip:554/stream"
```

## Notes

- The default model is `yolo11n.pt`. Ultralytics will download it on first use if it is not already available locally.
- Detection counts are posted automatically to the backend at `http://localhost:5000/api/detections` unless you override `BACKEND_DETECTIONS_URL`.
- Press `q` or `Esc` to close the live window.
