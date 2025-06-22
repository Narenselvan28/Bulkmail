const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Replace with your credentials
const senderEmail = 'bulkmailbynaren@gmail.com';
const senderPassword = 'uhms yyaj ivzi fozm'; // App password

app.post('/send', async (req, res) => {
    const msg = req.body.message;
    const idlist = req.body.idlist;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPassword,
        },
    });

    try {
        for (let i = 0; i < idlist.length; i++) {
            await transporter.sendMail({
                from: senderEmail,
                to: idlist[i],
                subject: 'Hello',
                text: msg,
            });
            console.log('📧 Email sent to:', idlist[i]);
        }
        res.send(true);
    } catch (error) {
        console.error('❌ Error sending emails:', error);
        res.status(500).send(false);
    }
});

app.listen(5000, () => {
    console.log('✅ Server is running on port 5000');
});
