const dbservices = require('../utils/DbServices');

const db = dbservices.getdbinstance();

exports.getAllNotes = (req, res) => {
    const {id} = req.params;
    const result = db.getallcards(id);
    result
        .then(data => res.json({
            Success : true,
            Data : data
        }))
        .catch(err => console.log(err));
};

exports.createNote = (req, res) => {
    const {note_title, note_description, user_id} = req.body;
    const result = db.insertnote(note_title, note_description, user_id); 
    result
        .then(data => {res.json({
                Success : true,
                result : data
            })
        })
        .catch(err => console.log(err));

};

exports.deleteNote = (req, res) => {
    const {id} = req.params;
    const result = db.deletenotes(id);
    result
        .then(data => {
            res.json({
                Success : true,
                result : "Card Deleted Sucessfully"
            })
        })
        .catch(err => console.log(err));
};

exports.searchNote = (req, res) => {
    let {id : user_id} = req.params;
    let {title, description, from_date, to_date} = req.query;
    const result = db.searchnotes(title, description, from_date, to_date, user_id);
    result
        .then(data => res.json({
            Sucess : true,
            data : data
        }))
        .catch(err => console.log(err));
}

exports.updateNote = (req, res) => {
    const {id}=  req.params ;
    const {note_title, note_description} = req.body;
    const result = db.updatenotes(id, note_title, note_description);
    result
        .then((data) => {
            res.json({
                Success : true,
                data : data
            })
        })
        .catch(err => console.log(err));
};