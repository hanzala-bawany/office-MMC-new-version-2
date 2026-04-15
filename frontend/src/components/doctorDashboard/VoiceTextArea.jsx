import { useRef, useState } from 'react'
import axios from 'axios'
import { base_URL } from '../../utills/baseUrl'


const MicIcon = ({ color = 'currentColor' }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
)

const VoiceTextArea = ({ label, fieldKey, value, onChange, placeholder, rows = 3 , driverId }) => {

    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const startRecording = async () => {

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (err) {
            console.error('Mic access error:', err)
        }

    }

    const stopRecording = () => {
        const mediaRecorder = mediaRecorderRef.current
        if (!mediaRecorder) return

        mediaRecorder.onstop = async () => {
            if (chunksRef.current.length === 0) {
                setIsProcessing(false)
                return
            }

            setIsProcessing(true)
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
            const formData = new FormData()
            formData.append('audio', blob, 'recording.webm')

            try {
                const res = await axios.post(`${base_URL}/api/voice/transcribe`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                const text = res.data.text
                if (text) onChange(text.trim())
            } catch (err) {
                console.error('Transcription error:', err)
            } finally {
                setIsProcessing(false)
            }

            mediaRecorder.stream.getTracks().forEach(t => t.stop())
        }

        mediaRecorder.stop()
        setIsRecording(false)
    }

    const toggleMic = () => {
        if (isProcessing) return
        isRecording ? stopRecording() : startRecording()
    }

    const micBtnStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: isRecording ? '1px solid #ef4444' : '1px solid #d1d5db',
        background: isRecording ? '#ef4444' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isProcessing ? 'wait' : 'pointer',
        transition: 'all 0.2s',
        zIndex: 1,
    }

    return (

        <div id={driverId} className="flex flex-col gap-1">
            <label className={`text-sm font-medium transition-colors duration-200 ${isRecording ? 'text-red-500' : 'text-gray-500'
                }`}>
                {label}
                {isRecording && (
                    <span className="ml-2 text-xs font-normal animate-pulse text-red-400">
                        Recording...
                    </span>
                )}
                {isProcessing && (
                    <span className="ml-2 text-xs font-normal text-blue-400">
                        Processing...
                    </span>
                )}
            </label>

            <div style={{ position: 'relative' }}>
                <textarea
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full resize-none rounded-md border px-3 py-2 text-sm transition-all duration-200 outline-none
            ${isRecording
                            ? 'border-red-400 ring-2 ring-red-100'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        }`}
                    style={{ paddingRight: '44px' }}
                />

                <button
                    type="button"
                    onClick={toggleMic}
                    disabled={isProcessing}
                    style={micBtnStyle}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                    {isProcessing ? (
                        <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke={isRecording ? '#fff' : '#6b7280'} strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    ) : (
                        <MicIcon color={isRecording ? '#fff' : '#6b7280'} />
                    )}
                </button>
            </div>
        </div>

    )
}

export default VoiceTextArea