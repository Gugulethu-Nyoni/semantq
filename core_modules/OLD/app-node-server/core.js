import express from 'express';
import cors from 'cors';
import path from 'path';
import * as fs from 'fs';

const app = express();
const port = 3000;

// Enable CORS for all incoming requests
app.use(cors());

app.get('/checkFileExists', (req, res) => {
  const fullPath = 'http://localhost:5173/src/routes/about/+page.smq';//req.query.fileName;
  const absolutePath = fullPath; //path.resolve(__dirname, path.join('..', fullPath));

  fs.access(fullPath, (err) => {
    if (err) {
      console.error('Error accessing file:', fullPath, '|', err.message);
      res.status(404).send({ exists: false }); // Send { exists: false } if the file does not exist
} else {
      console.log('File exists:', fullPath);
      res.status(200).send({ exists: true }); // Send { exists: true } if the file exists
}
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
