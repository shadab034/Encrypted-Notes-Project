const dbservices = require('../utils/DbServices');
const path = require('path');
const db = dbservices.getdbinstance();

exports.data_validation = (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return res.render('i.hbs', {
        status : 'error',
        error : "Please enter your Email id & Password"
    });
    const result = db.Validation(email);
    result
        .then(data => {
            if(data.length > 0){
                return res.status(409).render('i.hbs', {details : 'Email Id already exist'});
            }
            next();
        })
        .catch(err => console.log(err));
};