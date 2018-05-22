const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');

// @route   GET api/posts/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post
    .find()
    .sort({ date: -1 })
    .populate('user', ['id', 'username'])
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post
    .findById(req.params.id)
    .populate('user', ['id', 'username'])
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    title: req.body.title,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
    likes: [],
    dislikes: [],
  });

  Post
    .create(newPost)
    .then(post => res.json(post))
    .catch(err => res.json(err));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => {
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'User not authorized' });
      }
      post
        .remove()
        .then(() => res.json({ success: true }))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => {
      if( post.likes.some(like => like.user.toString() === req.user.id) ) {
        post.likes = post.likes.filter(item => item.user.toString() !== req.user.id);
        return post
                .save()
                .then(post => res.json(post))
                .catch(err => res.json(err));
      }

      if( post.dislikes.some(like => like.user.toString() === req.user.id) ) {
        post.dislikes = post.dislikes.filter(item => item.user.toString() !== req.user.id)
      }

      post.likes.unshift({ user: req.user.id });

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/unlike/:id
// @desc    Dislike post
// @access  Private
router.post('/dislike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => {
      if( post.dislikes.some(like => like.user.toString() === req.user.id) ) {
        post.dislikes = post.dislikes.filter(item => item.user.toString() !== req.user.id);
        return post
                .save()
                .then(post => res.json(post))
                .catch(err => res.json(err));
      }

      if( post.likes.some(like => like.user.toString() === req.user.id) ) {
        post.likes = post.likes.filter(item => item.user.toString() !== req.user.id)
      }

      post.dislikes.unshift({ user: req.user.id });

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    if(!isValid) {
      return res.status(400).json(errors);
    };

    Post
      .findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);

        post
          .save()
          .then(post => res.json(post.comments[0]))
          .catch(err => res.json(err));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post
      .findById(req.params.id)
      .then(post => {
        if( !post.comments.some(comment => comment._id.toString() === req.params.comment_id )) {
          return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        };

        const removeIndex = post.comments.findIndex(item => item._id.toString() === req.params.comment_id)

        if(req.user.id !== post.comments[removeIndex].user.toString()) {
           return res.status(401).json({ notauthorized: "User not authorized" });
        };

        post.comments.splice(removeIndex, 1);

        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.json(err));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   POST api/posts/comment/best/:id:comment_id
// @desc    Sign as the best comment
// @access  Private
router.post('/comment/best/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Post
    .findById(req.params.id)
    .populate('user', ['id', 'username'])
    .then(post => {
      if( !post.comments.some(comment => comment._id.toString() === req.params.comment_id )) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      };

      if(req.user.id !== post.user._id.toString()) {
         return res.status(401).json({ notauthorized: "User not authorized" });
      };

      post.comments.forEach( comment => {
        if(comment._id.toString() === req.params.comment_id) {
          comment.best = comment.best ? false : true;
        } else {
          comment.best = false
        }
      })

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);


module.exports = router;
