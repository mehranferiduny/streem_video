const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);


const app = express();
const port = 3000;

// اجازه دهید Express JSON و فایل‌ها را پردازش کند
app.use(express.json());
app.use(express.static('public'));

// راه‌اندازی صفحه اصلی
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// آغاز ویدیو استریم
app.get('/video', (req, res) => {
  const videoPath = 'url video'; // مسیر ویدیو مورد نظر خود را وارد کنید

  ffmpeg(videoPath)
    .inputFormat('mp4')
    .videoCodec('libx264')
    .audioCodec('aac')
    .format('mp4') 
    .outputOptions('-movflags frag_keyframe+empty_moov')
    .on('start', (command) => {
      console.log('ffmpeg process started:', command);
    })
    .on('end', () => {
      console.log('ffmpeg process ended');
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error:', err);
      console.error('ffmpeg stderr:', stderr);
    })
    .pipe(res, { end: true });
});

// راه‌اندازی سرور
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});