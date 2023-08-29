const express = require('express');
const controllers = require('../controllers/NotesControllers');
const Authentication = require('../middlewares/Authentication');

const router = express.Router();

router.route('/')
    .post(controllers.createNote)

router.route('/:id')
    .get(controllers.getAllNotes)
    .delete(controllers.deleteNote)
    .patch(controllers.updateNote)

router.get('/search/:id', controllers.searchNote);

module.exports = router;