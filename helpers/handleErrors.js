module.exports = (err, req, res, next) => {
	if (err.kind === 'ObjectId') {
		return res.status(404).json({
			error: true,
			message: 'Invalid resource ID',
		});
	}
	if (err.name === 'JsonWebTokenError') {
		return res
			.status(400)
			.json({ error: true, message: 'Invalid URL (Token not verified)' });
	}
	res.status(400).json({ error: true, message: err.message });
};
