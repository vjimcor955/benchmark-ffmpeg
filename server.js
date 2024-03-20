import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import multer from 'multer';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

/**
 * Multer disk storage configuration.
 * @type {import('multer').StorageEngine}
 */
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const codec = req.headers.codec;
    const outputName = `${file.originalname.split('.')[0]}_${codec}.${file.originalname.split('.')[1]}`;
    cb(null, outputName);
  }
});
const upload = multer({ storage: storage });

/**
 * Handles the POST request for uploading a video.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.post('/codecs', upload.single('video'), (req, res) => {
  console.log('Received video:', req.file);

  const codec = req.headers.codec;

  // FFmpeg command to convert the video.
  const ffmpegCommand = `ffmpeg -i ${req.file.path} -c:v ${codec} results/${req.file.filename}`;

  console.log(`Path: ${req.file.path}`)
  console.log(`Codec: ${codec}`)
  console.log(`FFmpeg command: ${ffmpegCommand}`)

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  });

  const qualityMetricsCommand = `ffmpeg-quality-metrics results/${req.file.filename} ${req.file.path} \
  -m psnr ssim vmaf`

  exec(qualityMetricsCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    const response = {
      message: 'Video processed successfully!',
      filename: req.file.filename,
      // SSIM, PSNR y VMAF
      quality_metrics: JSON.parse(stdout),
    };    
    res.status(200).send(response);
  });
});

app.post('/command', upload.single('video'), (req, res) => {
  console.log('Received video:', req.file);

  const command = req.headers.command;

  const ffmpegCommand = `ffmpeg -i ${req.file.path} ${command}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  });

  const qualityMetricsCommand = `ffmpeg-quality-metrics results/${req.file.filename} ${req.file.path} \
  -m psnr ssim vmaf`

  exec(qualityMetricsCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    const response = {
      message: 'Video processed successfully!',
      filename: req.file.filename,
      // SSIM, PSNR y VMAF
      quality_metrics: JSON.parse(stdout),
    };    
    res.status(200).send(response);
  });
});

/**
 * Handles the GET request for the root endpoint.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.get('/', (req, res) => {
  console.log('Server up!')
  res.send('Server up!');
});

/**
 * Shows the port where the server is running.
 * @param {number} PORT - The port number.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
