import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load client secrets from a local file.
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json'); // path to your credentials.json file
const TOKEN_PATH = path.join(__dirname, 'token.json'); // path to your token.json file

async function authorize() {
  const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(CREDENTIALS_PATH)).installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  } 
  // else {
  //   await getAccessToken(oAuth2Client);
  // }
  return oAuth2Client;
}

// async function getAccessToken(oAuth2Client) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/gmail.send'],
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   const code = await new Promise((resolve) => rl.question('Enter the code from that page here: ', resolve));
//   rl.close();
//   const token = (await oAuth2Client.getToken(code)).tokens;
//   oAuth2Client.setCredentials(token);
//   // Store the token to disk for later program executions
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//   console.log('Token stored to', TOKEN_PATH);
// }

async function sendMail(auth, to, subject, body) {
  const gmail = google.gmail({ version: 'v1', auth });
  const raw = createEmail(to, subject, body);
  await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw,
    },
  });
}

function createEmail(to, subject, body) {
  const messageParts = [
    // 'From: "Gagan Khandelwal" <your-email@gmail.com>',
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return encodedMessage;
}

export { authorize, sendMail };
