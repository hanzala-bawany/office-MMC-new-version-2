import { Button, Tag, Select } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";

const GetVoice1 = ({ formHandler, resetTrigger }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const parseVoiceToForm = (text) => {
    if (!selectedField) return;

    const trimmed = text.trim();

    if (selectedField === "treatment") {
      formHandler("treatment", trimmed);
    } else if (selectedField === "primaryComplain") {
      formHandler("primaryComplain", trimmed);
    }
  };

  const startRecording = async () => {

    if (!selectedField) return; // field select kiye bina recording nahi

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    setIsRecording(true);

  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {

      if (chunksRef.current.length === 0) {
        console.log("No audio recorded");
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true); 
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      try {
        const res = await axios.post(
          `${base_URL}/api/voice/transcribe`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        const text = res.data.text;
        if (text) {
          setTranscript(text);
          parseVoiceToForm(text);
        }
      } catch (err) {
        console.error("Transcription error:", err);
      } finally {
        setIsProcessing(false);
      }

      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorder.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!selectedField) return;
    isRecording ? stopRecording() : startRecording();
  };

  useEffect(() => {
    setTranscript("");
  }, [resetTrigger]);

  return (

    <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
      
      {/* Mic Button + Status */}
      <div className="flex items-center gap-3 flex-1">
        <Button
          type={isRecording ? "primary" : "default"}
          danger={isRecording}
          shape="circle"
          size="large"
          onClick={toggleRecording}
          loading={isProcessing}
          disabled={!selectedField}
          title={!selectedField ? "Pehle field select karein" : ""}
        >
          {!isProcessing && "🎤"}
        </Button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">
            {!selectedField
              ? "Pehle field choose karein"
              : isProcessing
                ? "Processing..."
                : isRecording
                  ? "Recording... (press to stop)"
                  : `${selectedField === "treatment" ? "Treatment" : "Complain"} ke liye bolein`}
          </span>
          <span className="text-xs text-gray-400">
            Field select karo, mic dabao, bolo, phir dobara dabao
          </span>
        </div>
      </div>

      {/* Field Selector Dropdown */}
      <Select
        placeholder="Please select field"
        value={selectedField}
        onChange={(val) => {
          setSelectedField(val);
          setTranscript("");
        }}
        style={{ width: 180 }}
        disabled={isRecording || isProcessing}
        options={[
          { value: "primaryComplain", label: "🩺 Complain" },
          { value: "treatment", label: "💊 Treatment" },
        ]}
      />

      {/* Transcript Preview */}
      {
        // transcript && (
        //     <Tag color="blue" className="max-w-[300px] truncate">
        //         {transcript.slice(-35)}
        //     </Tag>
        // )
      }
    </div>
  );
};

export default memo(GetVoice1);

