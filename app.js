const express = require('express');
const path = require('path');
const cors = require('cors');
const {logger} = require('./middlewares/logevent');
const errorlog = require('./middlewares/errormiddleware');
const cors_config = require('./config/CorsConfig');
const GlobalErrorHandler = require('./controllers/ErrorController');
const NotesRoutes = require('./routes/NoteRoutes');
const UserRoutes = require('./routes/UserRoutes');
const { id } = require('date-fns/locale');
const Authentication = require('./middlewares/Authentication');
const CookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const dbconnection = require('./config/DatabaseConfig');
const jwt = require('jsonwebtoken');
const passwordController = require('./controllers/PasswordController');
const filemiddleware = require('./middlewares/FileUpload');

const app = express();
// const PORT = 3500;
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));

app.use(fileupload());
app.use(cors(cors_config));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(CookieParser());
app.use('/Upload', express.static(path.join(__dirname, 'Upload')));

app.post('/upload/image', filemiddleware.fileExtMatch, filemiddleware.fileSizeLimiter, (req, res) => {
    if(!req.cookies.userLoggedIn) return res.status(401).redirect('/note_web');
    const decoded = jwt.verify(req.cookies.userLoggedIn, process.env.JWT_SECRET_KEY);
    let ImageFile = {...req.files};
    ImageFile = ImageFile.sampleFile;
    // console.log(ImageFile);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let Filename = ImageFile.type === 'image/jpeg'? `${decoded.id}.jpeg` : 
                    ImageFile.type === 'image/jpg'? `${decoded.id}.jpg` : `${decoded.id}.png`; 
    ImageFile.mv(path.join(__dirname, 'upload', Filename), function (err) {
        if (err) return res.status(500).send(err);
        dbconnection.query('UPDATE users SET profile_image = ? WHERE user_id = ?', [Filename, decoded.id], (err, rows) => {
            if (!err) {
                res.redirect('/note_web');
            } 
            else {
                console.log(err);
            }
        });
    });
    // res.redirect('/note_web');
})

app.post('/forgot-password', passwordController.link_mail_generator);

app.get("/reset-password/:token/:id", passwordController.reset_password);

app.post("/reset-password/:token/:id", passwordController.reset_password_db);


app.get('^/$|/index(.html)?', Authentication.isLoggedIn, (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'view', 'index.html'));
    if(req.user){
        res.status(200).redirect('/note_web');
    }
    else{
        res.status(200).render('i.hbs', {status : "LoggedIn", user : req.user});
    }
});

app.get('/note_web(.html)?', Authentication.isLoggedIn, (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'view', 'check.html'));
    if(req.user){
        res.status(200).render('Notes_web.hbs', {status : "LoggedIn", user : req.user});
    }
    else{
        res.status(200).render('i.hbs', {status : "LoggedOut", user : "null"});
    }
});

app.use('/api/v1/notes', NotesRoutes);
app.use('/auth', express.static(path.join(__dirname, 'public')));
app.use('/auth', UserRoutes);

app.all('*', (req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
    res.status(404).render('404.ejs');
})

app.use(GlobalErrorHandler);
app.use(errorlog);

module.exports = app;