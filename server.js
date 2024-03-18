import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Route to handle video conversion
app.get('/:video/:codec', (req, res) => {
  // Declare input video file
  // const inputVideo = 'city.mp4';
  const inputVideo = req.query.video;
  // Declare requested codec
  const codec = req.params.codec;

  // Execute FFmpeg command to convert video
  exec(`ffmpeg -i ${inputVideo} -c:v ${codec} output_${codec}.mp4`, (error, stdout, stderr) => {
    // Handle error
    if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Video conversion failed' });
        return;
    }
    if (stderr) {
        console.error(`FFmpeg error: ${stderr}`);
        res.status(500).json({ error: 'Video conversion failed' });
        return;
    }
    // Success message
    console.log(`Video converted successfully to ${codec} format`);
    res.status(200).json({ message: `Video converted successfully to ${codec} format`});
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
