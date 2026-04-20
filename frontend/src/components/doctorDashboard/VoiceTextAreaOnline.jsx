import { useRef, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";



const MicIcon = ({ color = "currentColor" }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);


const VoiceTextAreaOnline = ({ label, fieldKey, value , formHandler , placeholder, rows = 3, driverId ,resetTrigger , onChange }) => {

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =  useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);
  const micBtnStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: isRecording ? "1px solid #ef4444" : "1px solid #d1d5db",
  background: isRecording ? "#ef4444" : "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  zIndex: 1,
};

  //   console.log(transcript, "<<<<<<<<<<<<");

  if (!browserSupportsSpeechRecognition) {
    return toast.info("Browser not supported");
  }

  const toggleRecording = async () => {

    try {

      if (!isRecording) {
        resetTranscript();
        await SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
        });
        setIsRecording(true);

      }
      else {
        await SpeechRecognition.stopListening();
        // setTimeout(() => {
          resetTranscript();
        // }, 100);
        setIsRecording(false);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Microphone error occurred");
      setIsRecording(false);
    }

  };

  const parseVoiceToForm = (text) => {

    const lower = text.toLowerCase();

    if (fieldKey == "treatment") {
      formHandler("treatment", lower.trim());
    }
    else if (fieldKey == "primaryComplain") {
      formHandler("primaryComplain", lower.trim());
    }
  };


  useEffect(() => {
    if (isRecording && transcript) {
      parseVoiceToForm(transcript);
    }
  }, [transcript]);


  useEffect(() => {
    resetTranscript();
  }, [resetTrigger]);



  return (
    <div id={driverId} className="flex flex-col gap-1">
      <label
        className={`text-sm font-medium transition-colors duration-200 ${isRecording ? "text-red-500" : "text-gray-500"}`}
      >
        {label}
        {isRecording && (
          <span className="ml-2 text-xs font-normal animate-pulse text-red-400">
            Recording...
          </span>
        )}
      </label>

      <div style={{ position: "relative" }}>
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full resize-none rounded-md border px-3 py-2 text-sm transition-all duration-200 outline-none
                        ${
                          isRecording
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        }`}
          style={{ paddingRight: "44px" }}
        />

        <button
          type="button"
          onClick={toggleRecording}
          style={micBtnStyle}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          <MicIcon color={isRecording ? "#fff" : "#6b7280"} />
        </button>
      </div>
    </div>
  );
};

export default VoiceTextAreaOnline;
