const dbconnection = require('../config/DatabaseConfig');
const bcrypt = require('bcrypt');

const instance = null;

class Dbservices{
    static getdbinstance(){
        return instance ? instance : new Dbservices();
    }

    async Validation(email){
        try {
            const responseObj = {status : 'not exist'}
            const query_result = await new Promise((resolve, reject) => {
                let query = `SELECT email_id FROM users WHERE email_id = ?`;
                dbconnection.query(query, [email], (err, result) => {
                    if(err) reject(new Error(err.message));
                    if(result.length > 0){
                        responseObj['status'] = 'exist';
                    }
                    resolve(result);
                })
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    async Signup(full_name, email, password){
        try {
            password = await bcrypt.hash(password, 12);
            const query_result = await new Promise((resolve, reject) => {
                let query = `INSERT INTO users (email_id, full_name, user_password, reg_date, reg_time) VALUES (?, ?, ?, current_date(), current_time())`
                dbconnection.query(query, [email, full_name, password], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result);
                })
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    async Login(email, password){
        try {
            const query_result = await new Promise((resolve, reject) => {
                let query = `SELECT * FROM users WHERE email_id = ?`;
                dbconnection.query(query, [email], async (err, results) => {
                    if(err) reject(new Error(err.message));
                    if(results.length == 0){
                        let responseObj = {status : 'Not Found', message : 'Incorrect Email Id'};
                        resolve(responseObj);
                    }
                    else{
                        if(!await bcrypt.compare(password, results[0].user_password)){
                            let responseObj = {status : 'error', message : 'Incorrect Password'};
                            resolve(responseObj);
                        }
                        else{
                            let responseObj = {
                                status : 'success',
                                message: "Login Successful",
                                userDetails : {
                                    id : results[0].user_id,
                                    firstname : results[0].full_name,
                                    email : results[0].email_id,
                                    reg_date : results[0].reg_date
                                }
                            }
                            resolve(responseObj);
                        }
                    }
                })
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    async forgot_password_link(email){
        try {
            let user = {};
            let errorobj = {};
            const query_result = await new Promise((resolve, reject) => {
                dbconnection.query('SELECT user_id, full_name, email_id, user_password FROM users WHERE email_id = ?', [email], (err, result) => {
                    if(err) reject(new Error(err.message));
                    if(result.length === 0){
                        errorobj.status = 404; 
                        errorobj.message = `User doesn't exist`;
                        resolve(errorobj);
                    }
                    else {
                        console.log(result);
                        user.id = result[0].user_id;
                        user.name = result[0].full_name;
                        user.email = result[0].email_id;
                        user.password = result[0].user_password;
                        resolve(user);
                    }
                });
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    async user_exist(id){
        let user = {};
        let errorobj = {};
        const query_result = await new Promise((resolve, reject) => {
            dbconnection.query('SELECT user_password FROM users WHERE user_id = ?', [id], (err, result) => {
                if(err) reject(new Error(err.message));
                if(result.length === 0){
                    errorobj.status = 404;
                    errorobj.message = `User doesn't exist`;
                    resolve(errorobj);
                }
                else {
                    user.password = result[0].user_password;
                    resolve(user);
                }
            });
        })
        return query_result;
    }

    async reset_password_db(id, password){
        const encryptedPassword = await bcrypt.hash(password, 12);
        const query_result = await new Promise((resolve, reject) => {
            dbconnection.query('UPDATE users SET user_password = ? WHERE user_id = ?', [encryptedPassword, id], (err, result) => {
                if(err) reject(new Error(err.message));
                console.log(result);
                resolve(result);
            });
        })
        return query_result;
    }

    //get all the note cards stored in the database
    async getallcards(user_id){
        try {
            const query_result = await new Promise((resolve, reject) => {
                let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, Note_Time, Note_Date FROM notes WHERE user_id = ?`;
                dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, user_id], (err, result) => {
                    if(err) reject(new Error(err.message));
                    result.forEach(element => {
                        // let buf = Buffer.from(element.Note_Description, 'utf-8');
                        // element.Note_Description = buf.toString();
                        // // buf = Buffer.alloc(1).fill();
                        // buf.fill();
                        // buf = Buffer.from(element.Note_Title, 'utf-8');
                        // element.Note_Title = buf.toString();
                        // buf.fill();
                        //alternative way
                        let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                        element.Note_Description = description_buf.toString();
                        let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                        element.Note_Title = title_buf.toString();
                    })
                    resolve(result);
                })
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    //insert new note cards in the database
    async insertnote(title, description, user_id){
        try {
            const query_result = await new Promise((resolve, reject) => {
                let query = `INSERT INTO notes(note_title, note_description, note_date, note_time, user_id, encrypted_title, encrypted_description) VALUES(?, ?, current_date(), current_time(), ?, aes_encrypt(?,?), aes_encrypt(?,?))`;
                dbconnection.query(query, [title, description, user_id, title, process.env.ENCRYPT_SECRET_KEY, description, process.env.ENCRYPT_SECRET_KEY], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result);
                })
            })
            return {
                note_id : query_result.insertId,
                note_title : title,
                note_description : description
            };
        } catch (error) {
            console.log(error)
        }

    }

    // delete an existing note card in the database
    async deletenotes(id){
        try {
            const query_result = await new Promise((resolve, reject) => {
                let query = `DELETE FROM notes WHERE note_id = ?;`;
                dbconnection.query(query, [id], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result); 
                })
            })
            return query_result;
        } catch (error) {
            console.log(error);
        }
    }

    //update an existing note card in the database
    async updatenotes(id, title, description){
        try {
            const note_id = parseInt(id, 10);
            const query_result = await new Promise((resolve, reject) => {
                if(title !== undefined && description !== undefined){
                    let query = `UPDATE notes SET notes.encrypted_title = aes_encrypt(?,?), notes.encrypted_description = aes_encrypt(?,?) WHERE note_id = ?`; 
                    dbconnection.query(query, [title, process.env.ENCRYPT_SECRET_KEY, description, process.env.ENCRYPT_SECRET_KEY, note_id], (err, result) => {
                        if(err) reject(new Error(err.message));
                        resolve(result);
                    });
                }
                else if(title !== undefined && description === undefined){
                    let query = `UPDATE notes SET notes.encrypted_title = aes_encrypt(?,?) WHERE note_id = ?`;
                    dbconnection.query(query, [title, process.env.ENCRYPT_SECRET_KEY, id], (err, result) =>{
                        if(err) reject(new Error(err.message));
                        resolve(result);
                    });
                }
                else if(description !== undefined){
                    let query = `UPDATE notes SET notes.encrypted_description = aes_encrypt(?,?) WHERE note_id = ?`;
                    dbconnection.query(query, [description, process.env.ENCRYPT_SECRET_KEY, id], (err, result) => {
                        if(err) reject(new Error(err.message));
                        resolve(result);
                    });
                }
                else{
                    resolve("Nothing has to be change");
                }
            });
            const obj = {
                Note_Id : id,
                Note_Title : title,
                Note_Description : description
            };
            return obj;
        } catch (error) {
            console.log(error);
        }
    }

    //search for the note cards in the database
    async searchnotes(title, description, from_date, to_date, user_id){
        try{
            const query_result = await new Promise((resolve, reject) => {
                if(title !== undefined && description !== undefined){
                    title = `%${title}%`;
                    description = `%${description}%`;
                    if(from_date !== '' && to_date !== ''){
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, 
                                    Note_Time, Note_Date FROM (SELECT * FROM notes WHERE notes.note_date BETWEEN ? AND ?) as date_table
                                        WHERE lower(convert(aes_decrypt(date_table.encrypted_title, ?) using utf8mb4)) like ? and 
                                        lower(convert(aes_decrypt(date_table.encrypted_description, ?) using utf8mb4)) like ? AND user_id = ?;`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, from_date, to_date, process.env.ENCRYPT_SECRET_KEY, title, process.env.ENCRYPT_SECRET_KEY, description, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                    else{
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, 
                        Note_Time, Note_Date FROM notes WHERE lower(convert(aes_decrypt(encrypted_title, ?) using utf8mb4)) like ? and 
                        lower(convert(aes_decrypt(encrypted_description, ?) using utf8mb4)) like ? and user_id = ?`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, title, process.env.ENCRYPT_SECRET_KEY, description, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                }
                else if(title !== undefined && description === undefined){
                    title = `%${title}%`;
                    if(from_date !== '' && to_date !== ''){
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description,
                         Note_Time, Note_Date FROM (SELECT * FROM notes WHERE notes.note_date BETWEEN ? AND ?) as date_table
                        WHERE lower(convert(aes_decrypt(encrypted_title, ?) using utf8mb4)) like ? and user_id = ?;`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, from_date, to_date, process.env.ENCRYPT_SECRET_KEY, title, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                    else{
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, Note_Time, Note_Date 
                        FROM notes WHERE lower(convert(aes_decrypt(encrypted_title, ?) using utf8mb4)) like ? and user_id = ?`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, title, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                }
                else if(title === undefined && description !== undefined){
                    description = `%${description}%`;
                    if(from_date !== '' && to_date !== ''){
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, 
                        Note_Time, Note_Date FROM (SELECT * FROM notes WHERE notes.note_date BETWEEN ? AND ?) as date_table
                        WHERE lower(convert(aes_decrypt(encrypted_description, ?) using utf8mb4)) like ? and user_id = ?;`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, from_date, to_date, process.env.ENCRYPT_SECRET_KEY, description, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                    else{
                        let query = `SELECT Note_Id, aes_decrypt(encrypted_title, ?) as Note_Title, aes_decrypt(encrypted_description, ?) as Note_Description, 
                        Note_Time, Note_Date FROM notes WHERE lower(convert(aes_decrypt(encrypted_description, ?) using utf8mb4)) like ? and user_id = ?`;
                        dbconnection.query(query, [process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, process.env.ENCRYPT_SECRET_KEY, description, user_id], (err, result) => {
                            if(err) reject(new Error(err.message));
                            result.forEach(element => {
                                let description_buf = new Buffer.from(element.Note_Description, 'utf-8');
                                element.Note_Description = description_buf.toString();
                                let title_buf = new Buffer.from(element.Note_Title, 'utf-8');
                                element.Note_Title = title_buf.toString();
                            })
                            resolve(result);
                        })
                    }
                }
                else if(from_date !== '' && to_date !== ''){
                    let query = `SELECT * FROM notes WHERE notes.note_date BETWEEN ? AND ? AND user_id = ?;`
                    dbconnection.query(query, [from_date, to_date, user_id], (err, result) => {
                        if(err) reject(new Error(err.message));
                        resolve(result);
                    })
                }
            });
            return query_result;
        }catch(error){
            console.log(error);
        }
    }

}

module.exports = Dbservices;