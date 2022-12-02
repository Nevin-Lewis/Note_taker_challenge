const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const uuid = require('./helpers/uuid');
const api = require('./public/assets/js/index.js');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

const readFromFile = util.promisify(fs.readFile);

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    console.info(`${req.method} request received to get note`);
  });
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for the notes`);
  
    readFromFile('./db/Notes.json').then((data) => res.json(JSON.parse(data)));
  });
  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text} = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      readAndAppend(newNote, './db/Notes.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting feedback');
    }
  });
  

  app.listen(PORT, () =>
  console.log(`App listenting at http://localhost:${PORT}`))
