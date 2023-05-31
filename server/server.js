import * as dotenv from 'dotenv';
dotenv.config({ debug: process.env.DEBUG });

import express from 'express';
import next from 'next';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

// Configure Next App
const port = process.env.PORT;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev: dev });
const handle = app.getRequestHandler();

// Import API Routes
import { authRouter } from './routes/authRoutes.js';
import { postRouter } from './routes/postRoutes.js';

app
	.prepare()
	.then(() => {
		// Configure Express Backend
		const server = express();
		const httpServer = http.createServer(server);
		const io = new Server(httpServer, {
			path: '/socket.io',
			cors: {
				origin: '*',
				methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
				allowedHeaders: ['Content-Type', 'Authorization'],
			},
		});

		const corsOptions = {
			origin: '*',
			methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
			preflightContinue: false,
			optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
		};

		// Implement Middleware
		server.use(cors(corsOptions));
		server.use(express.json());
		server.use(express.urlencoded({ extended: true }));
		// Invoke morgan logger middleware only in dev environment
		if (process.env.NODE_ENV !== 'production') {
			server.use(morgan('dev'));
		}

		// Establish Routes
		server.use('/api/v1/auth', authRouter);
		server.use('/api/v1/post', postRouter);

		server.get('*', (req, res) => {
			return handle(req, res);
		});

		io.on('connection', (socket) => {
			// console.log('SOCKET IO', socket.id);
			socket.on('new-post', (newPost) => {
				// console.log('SOCKET IO NEW POST ==>', post);
				socket.broadcast.emit('new-post', newPost);
			});
		});

		// Connect to Database
		const connectDB = function (url) {
			return mongoose.set('strictQuery', true).connect(url);
		};

		// Start Server
		const startServer = async function () {
			try {
				await connectDB(process.env.MONGO_URL);
				console.log(`Server is Connected to DATABASE...`);
				httpServer.listen(port, () => {
					console.log(`Server is Listening on PORT ${port}...`);
				});
			} catch (error) {
				console.log(error);
			}
		};

		startServer();
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});

// Old Configuration
// const app = express();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//	path: '/socket.io',
//	cors: {
//		origin: '*',
//		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
//		allowedHeaders: ['Content-Type', 'Authorization'],
//	},
// });

// Socket.io
// io.on('connection', (socket) => {
// 	// console.log('SOCKET IO', socket.id);
// 	socket.on('send-message', (message) => {
// 		// console.log('New message received ==>', message);
// 		socket.broadcast.emit('receive-message', message);
// 	});
// });
