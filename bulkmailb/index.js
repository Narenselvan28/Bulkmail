const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://naren:Naren%402006@cluster0.ylecrvu.mongodb.net/bulkmail?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB", err);
  });

const cred = mongoose.model("cred", {}, "passk")


app.use(cors());
app.use(express.json());

// Setup nodemailer transporter


app.post('/send', (req, res) => {
    const msg = req.body.message;
    const idlist = req.body.idlist;
    cred.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].toJSON().mail,
                pass: data[0].toJSON().passkey,
            },
        });

        new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < idlist.length; i++) {
                    await transporter.sendMail({
                        from: 'narenselvan28@gmail.com',
                        to: idlist[i],
                        subject: 'Hello',
                        text: msg,
                    });
                    console.log('Email sent to:', idlist[i]);
                }
                resolve();
            } catch (error) {
                reject(error); // Now this is properly handled
            }
        })
            .then(() => {
                res.send(true);
            })
            .catch((error) => {
                console.error('Error sending emails:', error);
                res.status(500).send(false);
            });

    }).catch(function (err) {
        console.log("Error fetching data from MongoDB", err);
    })

});

app.listen(5000, () => {
    console.log('✅ Server is running on port 5000');
});
