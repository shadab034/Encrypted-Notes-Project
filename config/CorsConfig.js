const whitelist = ['http://www.mywebsite.com', 'https://www.google.com', 'http://127.0.0.1:8080', 'http://localhost:8080', 'http://localhost:3500', 'http://127.0.0.1:3500', 'http://localhost:3500/auth/SignUp',
        'http://localhost:3500/api/v1/auth/SignUp', 'http://localhost:3500/auth/Login'];
const CorsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }
        else callback(new Error("Not allowed by CORS"));
    },
    optionsSuccessStatus : 200 
}

module.exports = CorsOption;