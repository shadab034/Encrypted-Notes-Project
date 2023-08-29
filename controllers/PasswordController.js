const dbservices = require('../utils/DbServices');
const dbconnection = require('../config/DatabaseConfig');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const jwt = require('jsonwebtoken');

const db = dbservices.getdbinstance();

module.exports.link_mail_generator =  async (req, res) => {
    const {email} = req.query;      
    let responseObj = {};
    const result = await db.forgot_password_link(email);
    responseObj = {...result};
    if(responseObj.status === 404) return res.json({...responseObj});
    else if(responseObj.id){
        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ email: responseObj.email, id: responseObj.id }, secret, {
            expiresIn: "15m",
        });
        const link = `http://localhost:3500/reset-password/${token}/${responseObj.id}/?email=${responseObj.email}`;
        let config = {
            service : 'gmail',
            auth : {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    
        let transporter = nodemailer.createTransport(config);
    
        let MailGenerator = new Mailgen({
            theme: "default",
            product : {
                name: "Mailgen",
                link : 'https://mailgen.js/'
            }
        })
    
        let response = {
            body: {
                name : responseObj.name,
                intro: "Password Reset link from Encrypted Notes has arrived as per your request!",
                table : {
                    data : [
                        {
                            Link : link
                        }
                    ]
                },
                outro: "This link is valid for only 15 minutes"
            }
        }
    
        let mail = MailGenerator.generate(response)
    
        let message = {
            from : process.env.EMAIL,
            to : responseObj.email,
            subject: "Reset Password",
            html: mail
        }
    
        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                message: "A link to reset password has been sent to your Email Id"
            })
        }).catch(error => {
            console.log(error);
            return res.status(500).json({ message : error.message });
        })
    }
};

module.exports.reset_password = async (req, res) => {
    try {
        const {token, id } = req.params;
        console.log(req.params);
        const user = await db.user_exist(id);
        let responseObj = {...user};
        if(responseObj.status === 404) return res.json({...responseObj});
        const secret = process.env.JWT_SECRET_KEY;
        const verify = jwt.verify(token, secret);
        res.render("reset-password.hbs", { email: verify.email, status: "Not Verified" });
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
};

module.exports.reset_password_db = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
        const user = await db.user_exist(id);
        let responseObj = {...user};
        if(responseObj.status === 404) return res.json({...responseObj});
        const secret = process.env.JWT_SECRET_KEY;
        const verify = jwt.verify(token, secret);
        const updatePassword = await db.reset_password_db(id, password);
        res.render("reset-password.hbs", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
};