import { Button, Tag } from 'antd'
import { memo, useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { toast } from 'react-toastify'


const GetVoice = ({ formHandler, resetTrigger }) => {

    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition()
    const [isRecording, setIsRecording] = useState(false);
    // const [transcript, setTranscript] = useState("");


    // console.log(transcript, "<<<<<<<<<<<<")
    if (!browserSupportsSpeechRecognition) {
        return toast.info("Browser not supported")
    }


    const toggleRecording = async () => {

        if (!isRecording) {
            SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
            setIsRecording(true);
            
        } else {
            resetTranscript()
            SpeechRecognition.stopListening()
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

        resetTranscript()

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

            {
                transcript &&
                <Tag color="blue" className="max-w-[300px] truncate">
                    {transcript.slice(-35)}
                </Tag>
            }

        </div>

    )
}

export default memo(GetVoice)














// import { Button, Tag, Select } from 'antd'
// import { memo, useEffect, useState } from 'react'
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// import { toast } from 'react-toastify'

// const GetVoice = ({ formHandler , resetTrigger }) => {

//   const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition()
//   const [isRecording, setIsRecording] = useState(false)
//   const [selectedField, setSelectedField] = useState(null) // dropdown selection

//   const voiceFields = [
//     { label: "Primary Diagnosis", value: "primaryDiagnosis" },
//     { label: "Recommended Tests", value: "medicalTests" },
//     { label: "Treatment / Medication", value: "treatment" },
//     { label: "Primary Complain", value: "primaryComplain" },
//   ]

//   if (!browserSupportsSpeechRecognition) {
//     return toast.info("Browser not supported")
//   }

//   // Reset transcript on next patient
//   useEffect(() => {
//     resetTranscript()
//   }, [resetTrigger, resetTranscript])

//   const toggleRecording = () => {
//     if (!isRecording) {
//       SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
//       setIsRecording(true)
//     } else {
//       SpeechRecognition.stopListening()
//       setIsRecording(false)
//     }
//   }

//   // Parse voice dynamically based on dropdown selection
//   useEffect(() => {
//     if (!transcript || !selectedField) return

//     const lower = transcript.toLowerCase()

//     let valueToSet = transcript

//     // Optional: you can parse voice by keywords if required
//     if (selectedField === "treatment") {
//       const match = lower.match(/treatment (.*?)(?=complain|$)/)
//       if (match) valueToSet = match[1].trim()
//     } else if (selectedField === "primaryComplain") {
//       const match = lower.match(/(complain|symptom|symptoms|problem|issue) (.*?)(?=treatment|$)/)
//       if (match) valueToSet = match[2].trim()
//     }

//     formHandler(selectedField, valueToSet)
//   }, [transcript, selectedField])

//   useEffect(() => {
//     resetTranscript()
//   }, [selectedField])

//   return (


//     <div className="p-4 border-t border-gray-200 flex flex-col gap-3 bg-gray-50 rounded-md shadow-sm">

//       {/* Dropdown to select which input field will receive voice */}
//       <div className="flex items-center   gap-10">

//       <div className='flex items-center  gap-3'>

//         <Button
//           type={isRecording ? "primary" : "default"}
//           danger={isRecording}
//           shape="circle"
//           size="large"
//           onClick={toggleRecording}
//           >
//           🎤
//         </Button>

//         <span className="text-sm text-gray-600">
//           {isRecording ? "Listening..." : "Click mic & speak"}
//         </span>

//       </div>

//         <Select
//           placeholder="Select field for voice input"
//           options={voiceFields}
//           style={{ width: 250 }}
//           value={selectedField}
//           onChange={(value) => setSelectedField(value)}
//         />

//       </div>



//       {/* Show live transcript */}
//       {transcript && (
//         <Tag color="blue" className="max-w-[400px] truncate">
//           {transcript}
//         </Tag>
//       )}
//     </div>
//   )
// }

// export default memo(GetVoice)

























