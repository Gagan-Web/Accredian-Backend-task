import prisma from "../models/refer.js";
import { authorize, sendMail } from "../services/gmailService.js";

import Errorhandler from "../utils/errorhandeler.js";
//get all Refers
export const fetchrefer = async (req, res, next) => {
  const refers = await prisma.referral.findMany({});

  return res.json({ status: 200, data: refers });
};

//Creat Refer
export const createRefer = async (req, res, next) => {
  const { referrerId, email, message } = req.body;
  
  // Manual validation
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Must be a valid email' });
  }
  // if (typeof referrerId !== 'number' || isNaN(referrerId)) {
  //   return res.status(400).json({ error: 'Referrer ID must be an integer' });
  // }
  if (message && typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a string' });
  }

  try {
    // Validate input data
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email are required" });
    }

    const newRefer = await prisma.referral.create({
      data: {
        referrerId: referrerId,
        email: email,
        message: message,
      },
    });

    try {
      const auth = await authorize();
      await sendMail(auth, email, 'Test Subject',`<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Referral Invitation</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 20px;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .content h1 {
                      color: #333333;
                  }
                  .content p {
                      color: #555555;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      background-color: #007bff;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 5px;
                  }
                  .footer {
                      text-align: center;
                      padding: 20px;
                      font-size: 12px;
                      color: #aaaaaa;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Join Us Today!</h1>
                  </div>
                  <div class="content">
                      <h1>Hi ${message},</h1>
                      <p>Your friend, has invited you to join our platform. Discover amazing features and connect with Accredian.</p>
              </div>
          </body>
          </html>`
      );
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return res.json({ status: 200, data: newRefer, msg: "refferal created" });
  } catch (error) {
    console.error(error);
  }
};
