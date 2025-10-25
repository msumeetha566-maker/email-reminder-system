// Simple Express server for Medication Email Reminder System
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const remindersRouter = require('./routes');
require('dotenv').config();
const { startScheduler } = require('./scheduler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/reminders', remindersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startScheduler(); // start the background scheduler when server starts
});
