import { useContext } from 'react';
import { UserContext } from '../context/index.js';
import Background from '../components/Background.js';
// import axios from 'axios';
// import PostPublic from '../components/PostPublic.js';
import Head from 'next/head';
// import Link from 'next/link';
// import { io } from 'socket.io-client';

// const socket = io(
// 	process.env.NEXT_PUBLIC_SOCKETIO,
// 	{ path: '/socket.io' },
// 	{
// 		reconnection: true,
// 	}
// );

function Home() {
	// const [state, setState] = useContext(UserContext);

	// const [newsFeed, setNewsFeed] = useState([]);

	// useEffect(() => {
	// 	// console.log('SOCKET IO ON JOIN', socket);
	// 	socket.on('receive-message', (message) => {
	// 		alert(message);
	// 	});
	// }, []);

	// useEffect(() => {
	// 	socket.on('new-post', (newPost) => {
	// 		setNewsFeed([newPost, ...props.posts]);
	// 	});
	// }, []);

	// const collection = newsFeed.length > 0 ? newsFeed : props.posts;

	return (
		<>
			<Head>
				<title>MERN Stack Social Network</title>
				<meta name='description' content='A Social Network by Johnson Elugbadebo' />
				<meta property='og:description' content='A Social Network by Johnson Elugbadebo' />
				<meta property='og:type' content='website' />
				<meta property='og:site_name' content="Johnson's Social Network" />
				<meta property='og:url' content='http://jesocialnetwork.com' />
				<meta
					property='og:image:secure_url'
					content='http://jesocialnetwork.com/images/defalt.jpg'
				/>
			</Head>

			<Background url='/images/default.jpg'>{'SOCIAL NETWORK APP HOME PAGE'}</Background>
			{/* <pre>{JSON.stringify(props.posts, null, 4)}</pre> */}

			{/* <button
					onClick={() => {
						console.log('Executed!!!');
						socket.emit('send-message', 'This is Johnson Elugbadebo!!!');
					}}>
					Send Message
				</button> */}
			<div className='container '>
				<div className='row'>
					<div className='col text-center'>
						<h1>Social Network Application</h1>
					</div>
				</div>
				<div className='row offset-md-4'>
					<div className=''>
						<ul>
							<li
								style={{
									listStyleType: 'none',
								}}>
								<strong>BUILT BY:</strong> JOHNSON ELUGBADEBO
							</li>
							<li
								style={{
									listStyleType: 'none',
								}}>
								<strong>DATE:</strong> SPRING 2023
							</li>
							<li
								style={{
									listStyleType: 'none',
								}}>
								<strong>LOCATION:</strong> CAMBRIDGE, MA
							</li>
							<li
								style={{
									listStyleType: 'none',
								}}>
								<strong>TECHNOLOGY STACK:</strong> MERN
								<ul>
									<li className=''>Database: MongoDB</li>
									<li className=''>Backend framework: Express.js</li>
									<li className=''>Frontend framework: React.js + Next.js</li>
									<li className=''>Server language: Node.js</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{/* <div className='row pt-5'>
					{collection.map((post) => (
						<div key={post._id} className='col-md-4'>
							<Link href={`/post/view/${post._id}`} legacyBehavior>
								<a style={{ textDecoration: 'none' }}>
									<PostPublic key={post._id} post={post} />
								</a>
							</Link>
						</div>
					))}
				</div> */}
		</>
	);
}

export async function getServerSideProps() {
	const response = await fetch('http://127.0.0.1:8080/api/v1/post/render/posts');
	const data = await response.json();
	console.log(data);
	return {
		props: { posts: data },
	};
}

export default Home;
