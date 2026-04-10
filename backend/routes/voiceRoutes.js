const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe', upload.single('audio'), async (req, res) => {

    try {
        const form = new FormData();
        form.append('audio', req.file.buffer, {
            filename: 'audio.wav',
            contentType: 'audio/wav',
        });

        const response = await axios.post('http://localhost:5001/transcribe', form, {
            headers: form.getHeaders(),
        });

        res.json({ text: response.data.text });
    } catch (err) {
        console.error('Voice error:', err.message);
        res.status(500).json({ error: 'Transcription failed' });
    }
    
});

module.exports = router;