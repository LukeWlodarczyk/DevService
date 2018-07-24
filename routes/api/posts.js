const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');

const catchErrors = require('../../helpers/catchErrors');
const post = require('../../controllers/posts');

// @route   GET api/posts
// @desc    Get posts
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.getAllPosts)
);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.getPostById)
);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.createPost)
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.removePost)
);

// @route   PUT api/posts/like/:id
// @desc    Like post
// @access  Private
router.put(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.likePost)
);

// @route   PUT api/posts/unlike/:id
// @desc    Dislike post
// @access  Private
router.put(
	'/dislike/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.dislikePost)
);

// @route   POST api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post(
	'/:id/comment',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.addComment)
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
	'/:id/comment/:comment_id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.removeComment)
);

// @route   PUT api/posts/comment/best/:id:comment_id
// @desc    Sign as the best comment
// @access  Private
router.put(
	'/comment/best/:id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(post.signAsTheBestComment)
);

module.exports = router;
