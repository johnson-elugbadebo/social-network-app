import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/index.js';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminRoute from '../../components/AdminRoute.js';
import parse from 'html-react-parser';
import moment from 'moment';

function Admin() {
	const [state] = useContext(UserContext);

	// Putting posts in state
	const [posts, setPosts] = useState([]);

	// Router
	const router = useRouter();

	useEffect(() => {
		if (state && state.token) {
			newsFeed();
		}
	}, [state && state.token]);

	const newsFeed = async function () {
		try {
			const { data } = await axios.get('/post/render/posts');
			// console.log('User Posts ===>', data.posts);
			setPosts(data.posts);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async function (post) {
		try {
			const answer = window.confirm('Are you sure you want to delete this post?');
			if (!answer) {
				return;
			}
			const response = await axios.delete(`/post/admin/render/delete-post/${post._id}`);

			// Toast notification
			if (response.data.error) {
				toast.error(response.data.error);
			} else {
				toast.success(response.data.success);
			}
			// Fetch Posts
			newsFeed();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<AdminRoute>
			<div className='container-fluid'>
				<div className='row py-5 bg-default-image text-light'>
					<div className='col text-center'>
						<h1>Admin</h1>
					</div>
				</div>

				<div className='row py-4'>
					<div className='col-md-10 offset-md-1'>
						{/* {JSON.stringify(posts, null, 2)} */}
						{posts &&
							posts.map((post) => (
								<div key={post._id} className='d-flex justify-content-between'>
									<div className='col-7'>{parse(post.content)}</div>
									<div className='col'>
										<b>{post.postedBy.name}</b>
									</div>
									<div className='col'>{moment(post.createdAt).format('MMMM Do YYYY')}</div>
									<div className='text-danger' onClick={() => handleDelete(post)}>
										Delete
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</AdminRoute>
	);
}
export default Admin;
