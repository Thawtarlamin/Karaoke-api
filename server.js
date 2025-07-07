
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
const UPLOAD_DIR = 'uploads';
const OUTPUT_DIR = 'outputs';

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/separate', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path;
  const jobId = path.parse(inputPath).name;
  const outputPath = path.join(OUTPUT_DIR, jobId);

  const cmd = `spleeter separate -p spleeter:2stems -o ${OUTPUT_DIR} ${inputPath}`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: 'Spleeter failed', detail: stderr });
    }

    return res.json({
      vocals: `/download/${jobId}/vocals.wav`,
      instrumental: `/download/${jobId}/accompaniment.wav`
    });
  });
});

app.use('/download/:id/:filename', (req, res) => {
  const filePath = path.join(OUTPUT_DIR, req.params.id, req.params.filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(path.resolve(filePath));
  }
  res.status(404).json({ error: 'File not found' });
});

app.get('/', (req, res) => res.send('🎵 Karaoke API running in Docker!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
