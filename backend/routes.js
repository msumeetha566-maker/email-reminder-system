const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_PATH = path.join(__dirname, 'data', 'reminders.json');

function loadReminders(){
  try {
    const raw = fs.readFileSync(DATA_PATH);
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function saveReminders(list){
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2));
}

router.get('/', (req, res) => {
  res.json(loadReminders());
});

router.post('/', (req, res) => {
  const { name, email, medication, datetime } = req.body;
  if (!name || !email || !medication || !datetime) {
    return res.status(400).json({ error: 'name, email, medication and datetime are required' });
  }
  const list = loadReminders();
  const newRem = {
    id: uuidv4(),
    name,
    email,
    medication,
    datetime,
    sent: false,
    createdAt: new Date().toISOString()
  };
  list.push(newRem);
  saveReminders(list);
  res.status(201).json(newRem);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const list = loadReminders();
  const filtered = list.filter(r => r.id !== id);
  saveReminders(filtered);
  res.json({ success: true });
});

module.exports = router;
