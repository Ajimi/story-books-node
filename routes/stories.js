const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../helpers/auth');



// Stories Index
router.get('/', (req, res) => {
    res.render('stories/index');
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});


// Process Add Story
router.post('/', (req, res) => {
    let allowComment;

    if (req.body.allowComments) {
        allowComment = true;
    } else {
        allowComment = false;
    }

    const newStory = {
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComment,
        body: req.body.body,
        user: req.user.id
    }
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story._id}`);
        })
});

module.exports = router;