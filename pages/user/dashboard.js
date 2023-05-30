import { useContext, useState, useEffect } from 'react';
import UserRoute from '../../components/UserRoute.js';
import { UserContext } from '../../context/index.js';
import PostForm from '../../components/PostForm.js';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostList from '../../components/PostList.js';
import People from '../../components/People.js';
import Link from 'next/link';
import { Modal, Pagination } from 'antd';
import CommentForm from '../../components/CommentForm.js';
import Search from '../../components/Search.js';
import { io } from 'socket.io-client';

const socket = io(
	process.env.NEXT_PUBLIC_SOCKETIO,
	{ path: '/socket.io' },
	{
		reconnection: true,
	}
);

function Dashboard() {
	const [state, setState] = useContext(UserContext);
	// State
	const [content, setContent] = useState('');
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);
	// Putting posts in state
	const [posts, setPosts] = useState([]);

	// people
	const [people, setPeople] = useState([]);

	// Comments
	const [comment, setComment] = useState('');
	// Show Comment Modal
	const [visible, setVisible] = useState(false);
	const [currentPost, setCurrentPost] = useState({});
	// Router
	const router = useRouter();
	// Pagination
	const [totalPosts, setTotalPosts] = useState(0);
	const [current, setCurrent] = useState(1);

	useEffect(() => {
		if (state && state.token) {
			newsFeed();
			findPeople();
		}
	}, [state, current]);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get('/post/render/total-posts');
				setTotalPosts(response.data.total);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [state]);

	const onChange = function (page) {
		// console.log(page);
		setCurrent(page);
	};

	const newsFeed = async function () {
		try {
			const response = await axios.get(`/post/render/news-feed/${current}`);
			// console.log('User Posts ===>', response.data.posts);
			setPosts(response.data.posts);
		} catch (error) {
			console.log(error);
		}
	};

	const findPeople = async function () {
		try {
			const response = await axios.get('/auth/find-people');
			//console.log('People ===>', response.data);
			setPeople(response.data.people);
		} catch (error) {
			console.log(error);
		}
	};

	const postSubmit = async function (e) {
		e.preventDefault();
		// console.log('Post ==>', content);

		try {
			const response = await axios.post('/post/create-post', { content, image });

			console.log('Create Post Response ==>', response.data);

			// Toast notification
			if (response.data.error) {
				toast.error(response.data.error);
			} else {
				toast.success(response.data.success);

				setContent('');
				setImage({});
				// Socket IO
				socket.emit('new-post', response.data.postCreated);
			}
			// Fetch Posts
			setCurrent(1);
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	const handleImage = async function (e) {
		const files = e.target.files[0];
		let formData = new FormData();
		formData.append('image', files);

		// console.log([...formData]);
		setUploading(true);

		try {
			const response = await axios.post('/post/upload-image', formData);
			// console.log('Uploaded image ==>', response);
			setImage({
				url: response.data.imageURL,
				public_id: response.data.public_id,
			});
			setUploading(false);
		} catch (error) {
			console.log(error);
			setUploading(false);
		}
	};

	const handleDelete = async function (post) {
		try {
			const answer = window.confirm('Are you sure you want to delete this post?');
			if (!answer) {
				return;
			}
			const response = await axios.delete(`/post/render/delete-post/${post._id}`);

			// Toast notification
			if (response.data.error) {
				toast.error(response.data.error);
			} else {
				toast.success(response.data.success);
				router.push('/user/dashboard');
			}
			// Fetch Posts
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	const handleFollow = async function (user) {
		// console.log('Add this user to the following list', user);
		try {
			const response = await axios.put('/auth/user-follow', { _id: user._id, name: user.name });
			// console.log('Handle Follow Response ===>', response.data);
			// Update local storage, update user, keep token
			let auth = JSON.parse(localStorage.getItem('auth'));
			auth.user = response.data.user;
			localStorage.setItem('auth', JSON.stringify(auth));
			// Update context
			setState({ ...state, user: response.data.user });
			// Update people state to remove person we just followed

			// console.log(typeof people); people is an object
			// let newPeople = Object.values(people.people);
			let filtered = people.filter((p) => p._id !== user._id);
			setPeople(filtered);
			// console.log(filtered);
			// Rerender newsfeed + Display posts of folks we are following
			newsFeed();
			// Toast notification
			toast.success(response.data.success);
		} catch (error) {
			console.log(error);
			toast.error(response.data.error);
		}
	};

	const handleLike = async function (_id) {
		// console.log('Like this post', _id);

		try {
			const response = await axios.put('/post/render/like-post', { _id });
			// console.log('Liked', response.data.post);
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	const handleUnLike = async function (_id) {
		// console.log('UnLike this post', _id);
		try {
			const response = await axios.put('/post/render/unlike-post', { _id });
			// console.log('UnLiked', response.data.post);
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	const handleComment = function (post) {
		setCurrentPost(post);
		setVisible(true);
	};

	const addComment = async function (e) {
		e.preventDefault();
		// console.log('add comment to this post id', currentPost._id);
		// console.log('save comment to database', comment);
		try {
			const response = await axios.put('/post/render/add-comment', {
				postID: currentPost._id,
				comment,
			});
			console.log('Add Comment', response.data);
			setComment('');
			setVisible(false);
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	const removeComment = async function (postID, comment) {
		// console.log(postID, comment);
		const answer = window.confirm('Are you sure you want to delete this comment?');
		if (!answer) {
			return;
		}

		try {
			const response = await axios.put('/post/render/remove-comment', { postID, comment });
			// console.log('Comment Removed', response.data);
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<UserRoute>
			<div className='container-fluid'>
				<div className='row py-5 bg-default-image text-light'>
					<div className='col text-center'>
						<h1>News Feed</h1>
					</div>
				</div>

				<div className='row py-3'>
					<div className='col-md-7'>
						<PostForm
							content={content}
							setContent={setContent}
							postSubmit={postSubmit}
							handleImage={handleImage}
							uploading={uploading}
							image={image}
						/>
						<br />
						<PostList
							posts={posts}
							handleDelete={handleDelete}
							handleLike={handleLike}
							handleUnLike={handleUnLike}
							handleComment={handleComment}
							removeComment={removeComment}
						/>
						{/* {totalPosts} */}
						<Pagination current={current} onChange={onChange} total={totalPosts} className='pb-5' />
					</div>
					{/* The <pre> tag defines preformatted text. */}
					{/* <pre>{JSON.stringify(posts, null, 3)}</pre> */}

					{/* <pre className='col-md-4'>{JSON.stringify(people.people, null, 4)}</pre> */}
					<div className='col-md-4'>
						<Search />
						<br />
						{state && state.user && state.user.following && (
							<Link href={`/user/following`} legacyBehavior>
								<a className='h6'>{state.user.following.length} Following</a>
							</Link>
						)}
						<People people={people} handleFollow={handleFollow} />
					</div>
				</div>

				<Modal open={visible} onCancel={() => setVisible(false)} title='Comment' footer={null}>
					<CommentForm comment={comment} addComment={addComment} setComment={setComment} />
				</Modal>
			</div>
		</UserRoute>
	);
}
export default Dashboard;
