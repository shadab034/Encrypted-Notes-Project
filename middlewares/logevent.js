const { format } = require('date-fns');
const { v4 : uuidv4 } = require('uuid'); 

const fs = require('fs');
const promisesfs = require('fs').promises;
const path = require('path');


const logfunction = async (message, filename) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logdata = `${dateTime} \t ${uuidv4()} \t${message}\n`;
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await promisesfs.mkdir(path.join(__dirname, '..', 'logs'));
            await promisesfs.writeFile(path.join(__dirname, '..', 'logs', filename), '');
        }
        await promisesfs.appendFile(path.join(__dirname, '..', 'logs', filename), logdata);
        
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logfunction(`${req.method}\t${req.headers.origin}\t${req.url}`,'requestlog.txt');
    next();
}

module.exports = {logger, logfunction};