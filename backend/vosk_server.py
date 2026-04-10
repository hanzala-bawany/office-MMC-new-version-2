from flask import Flask, request, jsonify
from faster_whisper import WhisperModel
import tempfile, os

app = Flask(__name__)

# model pehli baar download hoga (~150MB), phir offline
# model = WhisperModel("medium", device="cpu", compute_type="int8")
model = WhisperModel("base", device="cpu", compute_type="int8")
# model = WhisperModel("tiny", device="cpu", compute_type="int8")

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio"}), 400

    audio_file = request.files["audio"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        segments, _ = model.transcribe(tmp_path, language="en")
        text = " ".join([seg.text for seg in segments]).strip()
        return jsonify({"text": text})
    finally:
        os.unlink(tmp_path)

if __name__ == "__main__":
    print("Whisper server starting on port 5001...")
    app.run(port=5001, debug=False)