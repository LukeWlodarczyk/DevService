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
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const posts = await Post.find()
				.sort({ date: -1 })
				.populate('user', ['id', 'username', 'name', 'avatar']);

			if (!posts || posts.length === 0) {
				return res
					.status(404)
					.json({ error: true, message: 'There are no posts' });
			}

			res.json(posts);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id)
				.populate('user', ['id', 'username', 'name', 'avatar'])
				.populate('comments.user', ['username', 'name', 'avatar']);

			if (!post) {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}

			res.json(post);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const post = new Post({
			text: req.body.text,
			title: req.body.title,
			user: req.user.id,
			likes: [],
			dislikes: [],
			comments: [],
		});

		try {
			const newPost = await Post.create(paost);
			const populatedPost = await Post.populate(newPost, {
				path: 'user',
				select: ['id', 'username', 'name', 'avatar'],
			});
			res.json(populatedPost);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);

			if (!post) {
				return res
					.status(404)
					.json({ error: true, message: 'Post with that ID does not exist' });
			}

			if (post.user.toString() !== req.user.id) {
				return res.status(401).json({
					error: true,
					message: 'User not authorized. This post belongs to different user.',
				});
			}
			await post.remove();
			res.json({ success: true });
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   PUT api/posts/like/:id
// @desc    Like post
// @access  Private
router.put(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);

			if (!post) {
				return res
					.status(404)
					.json({ error: true, message: 'Post with that ID does not exist' });
			}

			if (post.likes.some(like => like.user.toString() === req.user.id)) {
				post.likes = post.likes.filter(
					item => item.user.toString() !== req.user.id
				);
				await post.save();
				return res.json(post);
			}

			if (post.dislikes.some(like => like.user.toString() === req.user.id)) {
				post.dislikes = post.dislikes.filter(
					item => item.user.toString() !== req.user.id
				);
			}

			post.likes.unshift({ user: req.user.id });

			await post.save();
			res.json(post);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   PUT api/posts/unlike/:id
// @desc    Dislike post
// @access  Private
router.put(
	'/dislike/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);

			if (!post) {
				return res
					.status(404)
					.json({ error: true, message: 'Post with that ID does not exist' });
			}

			if (post.dislikes.some(like => like.user.toString() === req.user.id)) {
				post.dislikes = post.dislikes.filter(
					item => item.user.toString() !== req.user.id
				);
				await post.save();
				return res.json(post);
			}

			if (post.likes.some(like => like.user.toString() === req.user.id)) {
				post.likes = post.likes.filter(
					item => item.user.toString() !== req.user.id
				);
			}

			post.dislikes.unshift({ user: req.user.id });

			await post.save();
			res.json(post);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   POST api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post(
	'/:id/comment',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validateCommentInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newComment = {
			text: req.body.text,
			user: req.user.id,
		};

		try {
			const post = await Post.findByIdAndUpdate(
				req.params.id,
				{
					$push: {
						comments: { $each: [newComment], $position: 0 },
					},
				},
				{ new: true }
			);

			const populatedPost = await Post.populate(post, {
				path: 'comments.user',
				select: ['id', 'username', 'name', 'avatar'],
			});
			res.json(populatedPost.comments[0]);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
	'/:id/comment/:comment_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);

			if (!post) {
			}

			if (
				!post.comments.some(
					comment => comment._id.toString() === req.params.comment_id
				)
			) {
				return res.status(404).json({
					error: true,
					message: 'Comment with that ID does not exist',
				});
			}

			const removeIndex = post.comments.findIndex(
				item => item._id.toString() === req.params.comment_id
			);

			if (req.user.id !== post.comments[removeIndex].user.toString()) {
				return res.status(401).json({
					error: true,
					message:
						'User not authorized. This comment belongs to different user.',
				});
			}

			post.comments.splice(removeIndex, 1);

			await post.save();
			res.json(post);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

// @route   PUT api/posts/comment/best/:id:comment_id
// @desc    Sign as the best comment
// @access  Private
router.put(
	'/comment/best/:id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const post = await Post.findById(req.params.id)
				.populate('user', ['id', 'username', 'name', 'avatar'])
				.populate('comments.user', ['id', 'username', 'name', 'avatar']);

			if (
				!post.comments.some(
					comment => comment._id.toString() === req.params.comment_id
				)
			) {
				return res.status(404).json({
					error: true,
					message: 'Comment with that ID does not exist',
				});
			}

			if (req.user.id !== post.user._id.toString()) {
				return res.status(401).json({
					error: true,
					message:
						'User not authorized. Only post author can sign comment as the best',
				});
			}

			post.comments.forEach(comment => {
				if (comment._id.toString() === req.params.comment_id) {
					comment.best = !comment.best;
				} else {
					comment.best = false;
				}
			});

			await post.save();
			res.json(post);
		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({
					error: true,
					message: 'Post with that ID does not exist',
				});
			}
			res.status(400).json(err);
		}
	}
);

module.exports = router;
