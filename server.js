import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

/**
 * Multer disk storage configuration for codec endpoint.
 * @type {import('multer').StorageEngine}
 */
const storageCodec = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const codec = req.headers.codec;
    const outputName = `${file.originalname.split('.')[0]}_${codec}.${file.originalname.split('.')[1]}`;
    cb(null, outputName);
  }
});
const uploadCodec = multer({ storage: storageCodec });

/**
 * Multer disk storage configuration.
 * @type {import('multer').StorageEngine}
 */
const storageCommand = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    // const outputName = `${file.originalname.split('.')[0]}_${Date.now()}.${file.originalname.split('.')[1]}`;
    const inputName = req.headers.input
    cb(null, inputName);
  }
});
const uploadCommand = multer({ storage: storageCommand });

/**
 * Handles the POST request for the /codecs endpoint.
 * Executes FFmpeg command to convert the video to the specified codec and returns the video converted along with its quality metrics.
 * 
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.post('/codecs', uploadCodec.single('video'), (req, res) => {
  const codec = req.headers.codec;
  console.log(`---------- CODEC: ${codec}`)

  const ffmpegCommand = `ffmpeg -i ${req.file.path} -c:v ${codec} results/${req.file.filename}`;
  console.log(`FFMPEG: ${ffmpegCommand}`)

  exec(ffmpegCommand, (fferror, ffstdout, ffstderr) => {
    if (fferror) {
      console.error('Error:', fferror);
      return;
    }
  });

  const qualityMetricsCommand = `ffmpeg-quality-metrics results/${req.file.filename} ${req.file.path} \
  -m psnr ssim vmaf`
  console.log(`QUALITY METRICS: ${qualityMetricsCommand}`)

  exec(qualityMetricsCommand, (qmError, qmStdout, qmStderr) => {
    if (qmError) {
      console.error('Error:', qmError);
      return;
    }

    const fileSizeCommand = `stat -c "%s" results/${req.file.filename}`;
    console.log(`FILE SIZE: ${fileSizeCommand}`)

    exec(fileSizeCommand, (fsError, fsStdout, fsStderr) => {
      if (fsError) {
        console.error('Error:', fsError);
        return;
      }
      const fileSize = (parseInt(fsStdout) * 0.000001).toFixed(2);

      const response = {
        filename: req.file.filename,
        codec: codec,
        size: fileSize,
        quality_metrics: JSON.parse(qmStdout),
      };    
      res.status(200).send(response);
    });
  });
});

/**
 * Handles the POST request for the /command endpoint.
 * Executes FFmpeg command to convert the video with the specified command and returns the video converted along with its quality metrics.
 * 
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.post('/command', uploadCommand.single('video'), (req, res) => {
  const command = req.headers.command;
  const output = req.headers.output;
  console.log(`---------- COMMAND: ${command}`)
  
  const ffmpegCommand = `ffmpeg -i ${req.file.path} ${command} results/${output}`;
  console.log(`FFMPEG: ${ffmpegCommand}`)

  exec(ffmpegCommand, (fferror, ffstdout, ffstderr) => {
    if (fferror) {
      console.error('Error:', fferror);
      return;
    }
  });

  // POSIBLE PROBLEMA: No se pueden comparar videos de distinto formato (results/avi uploads/mp4)
  const qualityMetricsCommand = `ffmpeg-quality-metrics results/${output} ${req.file.path} \
  -m psnr ssim vmaf`
  console.log(`QUALITY METRICS: ${qualityMetricsCommand}`)

  exec(qualityMetricsCommand, (qmError, qmStdout, qmStderr) => {
    if (qmError) {
      console.error('Error:', qmError);
      return;
    }
    console.log(`Quality Metrics ${command}`);

    const fileSizeCommand = `stat -c "%s" results/${output}`;
    console.log(`FILE SIZE: ${fileSizeCommand}`)

    exec(fileSizeCommand, (fsError, fsStdout, fsStderr) => {
      if (fsError) {
        console.error('Error:', fsError);
        return;
      }
      const fileSize = (parseInt(fsStdout) * 0.000001).toFixed(2);

      const response = {
        filename: req.file.filename,
        codec: command,
        size: fileSize,
        quality_metrics: JSON.parse(qmStdout),
      };    
      res.status(200).send(response);
    });
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
