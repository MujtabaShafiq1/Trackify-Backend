const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const appLogger = require('../utils/logger');

// socket users map
const users = new Map();

module.exports = function (app, server) {
	const io = socketIo(server, { cors: { origin: process.env.CLIENT_URL } });

	app.set('io', io);

	io.use((socket, next) => {
		try {
			const token = socket.handshake.headers.authorization;
			const user = jwt.verify(token, process.env.JWT_KEY);
			if (!user.id) return next(new Error('Invalid User'));
			users.set(user.id, socket.id);
			console.log(`${user.username} connected ${socket.id}`);
			next();
		} catch (ex) {
            appLogger.error(ex)
			return next(new Error(ex));
		}
	});

	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			try {
				const user = jwt.verify(socket.handshake.headers.authorization, process.env.JWT_KEY);
                console.log(`${user.username} disconnected`);
				users.delete(user.id);
			} catch (ex) {
                appLogger.error(ex)
				socket.disconnect();
			}
		});
	});

	const PORT = process.env.PORT;
	appLogger.info(`Server listening on PORT: ${PORT}`);
};
