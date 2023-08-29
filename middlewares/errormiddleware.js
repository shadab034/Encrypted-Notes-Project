const {logfunction} = require('./logevent');

const errorlog = (err, req, res, next) => {
    logfunction(`${req.headers.origin}\t${err.name}:\t${err.message}`, 'errorlog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);
}

module.exports = errorlog;