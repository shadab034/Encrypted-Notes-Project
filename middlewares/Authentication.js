const dbconnection = require('../config/DatabaseConfig');
const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = async (req, res, next) => {
    if(!req.cookies.userLoggedIn) return next();
    try {
        const decoded =  jwt.verify(req.cookies.userLoggedIn, process.env.JWT_SECRET_KEY);
        dbconnection.query(`SELECT user_id, email_id, full_name, reg_date, profile_image FROM users WHERE user_id = ?`, [decoded.id], (err, result) => {
            if(err) return next();
            else{
                req.user = result[0];
                return next();
            }
        })
    } catch (error) {
        if(error) return next();
    }
}

module.exports.is_User = async (req, res, next) => {
    if(!req.cookies.userLoggedIn) return res.status(401).json({message: 'You are not logged in'});
    try {
        const decoded = jwt.verify(req.cookies.userLoggedIn, process.env.JWT_SECRET_KEY);
        const {user_id} = req.body;
        if(user_id === decoded.id) next();
        else return res.status(401).json({
            status : 'Error',
            message : 'You are Unauthorized to perform this action'
        });
    } catch (error) {
        if(error) return res
    }
}