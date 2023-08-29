const path = require('path');
const MB = 5; 
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

module.exports.fileExtMatch = (req, res, next) => {
    const allowedExt = ['.png', '.jpeg', '.jpg'];
    let ImageFile = {...req.files};
    ImageFile = ImageFile.sampleFile;
    const fileExt = path.extname(ImageFile.name);
    const allowed = allowedExt.includes(fileExt);
    if(!allowed){
        const message = `Only ${allowedExt.toString()} files allowed`;
        return res.status(422).redirect('/note_web');
    }
    next();
}

module.exports.fileSizeLimiter = (req, res, next) => {
    const files = req.files

    let ImageFile = {...req.files};
    ImageFile = ImageFile.sampleFile;

    if (ImageFile.size > FILE_SIZE_LIMIT) {
        const message = `File ${ImageFile.name} over limit of ${MB} MB.`;
        return res.status(413).redirect('/note_web');
    }
    next()
}