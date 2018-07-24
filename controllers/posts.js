const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = mongoose.model('post');

const validatePostInput = require('../validation/post');
const validateCommentInput = require('../validation/comment');

exports.getAllPosts = async (req, res) => {
	const posts = await Post.find()
		.sort({ date: -1 })
		.populate('user', ['id', 'username', 'name', 'avatar']);

	if (!posts || posts.length === 0) {
		return res.status(404).json({ error: true, message: 'There are no posts' });
	}

	res.json(posts);
};

exports.getPostById = async (req, res) => {
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
};

exports.createPost = async (req, res) => {
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

	const newPost = await Post.create(post);
	const populatedPost = await Post.populate(newPost, {
		path: 'user',
		select: ['id', 'username', 'name', 'avatar'],
	});
	res.json(populatedPost);
};

exports.removePost = async (req, res) => {
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
};

exports.likePost = async (req, res) => {
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
};

exports.dislikePost = async (req, res) => {
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
};

exports.addComment = async (req, res) => {
	const { errors, isValid } = validateCommentInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newComment = {
		text: req.body.text,
		user: req.user.id,
	};

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
};

exports.removeComment = async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		return res.status(404).json({
			error: true,
			message: 'Post with that ID does not exist',
		});
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
			message: 'User not authorized. This comment belongs to different user.',
		});
	}

	post.comments.splice(removeIndex, 1);

	await post.save();
	res.json(post);
};

exports.signAsTheBestComment = async (req, res) => {
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
};
