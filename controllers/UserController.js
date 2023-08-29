const dbservices = require('../utils/DbServices');
const jwt = require('jsonwebtoken');

const db = dbservices.getdbinstance();

exports.User_Signup = (req, res) => {
    const {full_name, email, password} = req.body;
        const result = db.Signup(full_name, email, password);
        result
            .then(data => {
                res.status(201).render('i.hbs', {message : 'Account created, Kindly Login with your credentials'});
            })
            .catch(error => console.log(error));
};

exports.User_Login = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.render('i.hbs', {
        status : 'error',
        error : "Please enter your Email id & Password"
    });
    const result = db.Login(email, password);
    result.then(data => {
        const {status} = data;
        if(status === 'Not Found') res.status(404).render('i.hbs', {status : 'error', message : 'Email Id is not registered'});
        else if(status === 'error') res.status(401).render('i.hbs', {status : 'error', message : 'Incorrect Password'});
        else{
            const token = jwt.sign({id : data.userDetails.id}, process.env.JWT_SECRET_KEY, {
                expiresIn : process.env.JWT_EXPIRES
            })
            const CookieOptions = {
                expiresIn : new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly : true
            }
            res.cookie("userLoggedIn", token, {httpOnly : true, maxAge : process.env.COOKIE_EXPIRES * 24 * 60  * 60 * 1000, SameSite : process.env.SAME_SITE});
            res.status(200).redirect(`/note_web`);
        }
    })
};

exports.User_Logout = (req, res) => {
    res.cookie('userLoggedIn', '', {maxAge : 1});
    res.redirect('/');
};