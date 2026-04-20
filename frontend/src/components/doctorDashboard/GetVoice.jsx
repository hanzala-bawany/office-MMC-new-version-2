import { Button, Tag } from "antd";
import { memo, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";

const GetVoice = ({ formHandler, resetTrigger }) => {

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);
  // const [transcript, setTranscript] = useState("");

  //   console.log(transcript, "<<<<<<<<<<<<");
  if (!browserSupportsSpeechRecognition) {
    return toast.info("Browser not supported");
  }

  const toggleRecording = async () => {

    try {

      if (!isRecording) {
        await SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
        });
        setIsRecording(true);
      } 
      else {
        await SpeechRecognition.stopListening();
        setTimeout(() => {
          resetTranscript();
        }, 100);
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

    // const diagnosisMatch = lower.match(/diagnosis (.*?)(?=test|treatment|complain|symptom|$)/);
    // const testMatch = lower.match(/test (.*?)(?=diagnosis|treatment|complain|symptom|$)/);
    const treatmentMatch = lower.match(/treatment (.*?)(?=complain|$)/);
    const complainMatch = lower.match(/(complain) (.*?)(?=treatment|$)/);

    // if (diagnosisMatch) {
    //   formHandler("primaryDiagnosis", [diagnosisMatch[1].trim()]);
    // }

    // if (testMatch) {
    //   formHandler("medicalTests", [testMatch[1].trim()]);
    // }

    if (treatmentMatch) {
      formHandler("treatment", treatmentMatch[1].trim());
    }

    if (complainMatch) {
      formHandler("primaryComplain", complainMatch[2].trim());
    }
  };

  useEffect(() => {
    if (transcript) {
      parseVoiceToForm(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    resetTranscript();
  }, [resetTrigger]);

  
  return (
    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          type={isRecording ? "primary" : "default"}
          danger={isRecording}
          shape="circle"
          size="large"
          onClick={toggleRecording}
          className="flex items-center justify-center"
        >
          🎤
        </Button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">
            {isRecording ? "Listening..." : "Voice Entry"}
          </span>

          <span className="text-xs text-gray-400">
            Click mic and speak patient details
          </span>
        </div>
      </div>

      {transcript && (
        <Tag color="blue" className="max-w-[300px] truncate">
          {transcript.slice(-35)}
        </Tag>
      )}
    </div>
  );
};

export default memo(GetVoice);
