// scheduler: runs every minute, checks for reminders whose datetime <= now and not yet sent
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

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

async function sendEmail(reminder){
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: reminder.email,
    subject: `Medication Reminder: ${reminder.medication}`,
    text: `Hello ${reminder.name},\n\nThis is a reminder to take your medication: ${reminder.medication}\nScheduled for: ${reminder.datetime}\n\n- Medication Reminder System`
  });
  return info;
}

function startScheduler(){
  console.log('Scheduler started (runs every minute).');
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const list = loadReminders();
    let changed = false;
    for (const r of list){
      if (!r.sent){
        const remDate = new Date(r.datetime);
        if (remDate <= now){
          try {
            console.log('Sending email for', r.id, r.email);
            await sendEmail(r);
            r.sent = true;
            r.sentAt = new Date().toISOString();
            changed = true;
          } catch (e){
            console.error('Failed to send email for', r.id, e && e.message);
          }
        }
      }
    }
    if (changed) saveReminders(list);
  });
}

module.exports = { startScheduler };
