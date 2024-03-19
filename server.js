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
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

/**
 * Handles the POST request for uploading a video.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.post('/upload', upload.single('video'), (req, res) => {
  console.log('Received video:', req.file);
  const response = {
    message: 'Video uploaded successfully!',
    filename: req.file.filename,
  };
  res.status(200).send(response);
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
