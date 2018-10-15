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
    Story.find({
            status: 'public'
        })
        .populate('user')
        .sort({
            date: 'desc'
        })
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});
// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story: story
                });
            }
        });
});

router.get('/show/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            res.render('stories/show', {
                story: story
            });
        });
});


// List Stories from a user
router.get('/user/:id', (req, res) => {
    Story.find({
            user: req.params.id,
            status: 'public'
        }).populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        })
});

// Logged in user story
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
            user: req.user.id,
        }).populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        })
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

router.put('/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            let allowComment;

            if (req.body.allowComments) {
                allowComment = true;
            } else {
                allowComment = false;
            }


            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComment;
            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                })
        });
});

router.delete('/:id', (req, res) => {
    Story.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard')
        });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        // Add to comments array
        story.comments.unshift(newComment);
        story.save()
            .then(story => {
                res.redirect(`/stories/show/${story.id}`)
            });
    });

});




module.exports = router;