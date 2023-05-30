import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PostForm from '../../../components/PostForm.js';
import UserRoute from '../../../components/UserRoute.js';
import { toast } from 'react-toastify';

function EditPost() {
	const [post, setPost] = useState({});
	// State
	const [content, setContent] = useState('');
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);
	const router = useRouter();
	// console.log('router', router);

	const id = router.query._id;

	useEffect(() => {
		if (id) fetchPost();
	}, [id]);

	const fetchPost = async function () {
		try {
			const response = await axios.get(`/post/render/get-post/${id}`);
			// console.log(response.data);
			setPost(response.data.userPost);
			setContent(response.data.userPost.content);
			setImage(response.data.userPost.image);
		} catch (error) {
			console.log(error);
		}
	};

	const postSubmit = async function (e) {
		e.preventDefault();
		// console.log('Submit post to Update', content, image);

		try {
			const response = await axios.put(`/post/render/update-post/${id}`, { content, image });
			// console.log(response);
			// console.log('Create Post Response ==>', response);

			// Toast notification
			if (response.data.error) {
				toast.error(response.data.error);
			} else {
				toast.success(response.data.success);
				router.push('/user/dashboard');
			}
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
			console.log('Uploaded image ==>', response);
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

	return (
		<UserRoute>
			<div className='container-fluid'>
				<div className='row py-5 bg-default-image text-light'>
					<div className='col text-center'>
						<h1>News Feed</h1>
					</div>
				</div>

				<div className='row py-3'>
					<div className='col-md-8 offset-md-2'>
						<PostForm
							content={content}
							setContent={setContent}
							postSubmit={postSubmit}
							handleImage={handleImage}
							uploading={uploading}
							image={image}
						/>
					</div>
					{/* The <pre> tag defines preformatted text. */}
					{/* <pre>{JSON.stringify(posts, null, 3)}</pre> */}
				</div>
			</div>
		</UserRoute>
	);
}
export default EditPost;
