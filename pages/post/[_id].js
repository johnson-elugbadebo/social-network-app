import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserRoute from '../../components/UserRoute.js';
import { toast } from 'react-toastify';
import Post from '../../components/Post.js';
import Link from 'next/link';
import { RollbackOutlined } from '@ant-design/icons';

function PostComments() {
	const [post, setPost] = useState({});

	const router = useRouter();
	const id = router.query._id;

	useEffect(() => {
		if (id) {
			fetchPost();
		}
	}, [id]);

	const fetchPost = async function () {
		try {
			const response = await axios.get(`/post/render/get-post/${id}`);
			// console.log(response.data);
			setPost(response.data.userPost);
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
			console.log('Comment Removed', response.data);
			fetchPost();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='container-fluid'>
			<div className='container col-md-8 offset-md-2 pt-3'>
				<Post post={post} commentsCount={100} removeComment={removeComment} />
			</div>

			<Link href='/user/dashboard' legacyBehavior>
				<a className='d-flex justify-content-center p-5'>
					<RollbackOutlined />
				</a>
			</Link>
		</div>
	);
}
export default PostComments;
