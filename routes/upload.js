const express = require('express');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');
  },
  filename: (req, file, cb) => {
    console.log(file);
    let filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res, next) => {
  console.log('se ejecuta ' + req.file);
  if (!req.file) {
    res.status(500);
    return next(err);
  }
  res.json({ fileUrl: req.file.filename });
});

module.exports = router;
