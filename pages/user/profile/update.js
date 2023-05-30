import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Avatar } from 'antd';
import Link from 'next/link';
import AuthForm from '../../../components/AuthForm.js';
import { UserContext } from '../../../context/index.js';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

function ProfileUpdate() {
	const [state, setState] = useContext(UserContext);
	const [username, setUsername] = useState('');
	const [about, setAbout] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secret, setSecret] = useState('');
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	// Profile Image
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		// console.log('User from State ==>', state.user);
		if (state) {
			setUsername(state.user.username);
			setAbout(state.user.about);
			setName(state.user.name);
			setEmail(state.user.email);
			setImage(state.user.image);
		}
	}, [state]);

	const handleSubmit = async function (e) {
		e.preventDefault();
		const userInfo = {
			username: username,
			about: about,
			name: name,
			email: email,
			password: password,
			secret: secret,
			image: image,
		};

		try {
			setLoading(true);
			// Don't need "/api/v1" in endpoint because of axios config baseURL
			const { data } = await axios.put('/auth/profile-update', userInfo);
			// console.log('Update Response ==>', data.user);

			// if (data.status === 201) {
			// 	setOk(!ok);
			// }

			// keep these in state, no need to reset
			// setName('');
			// setEmail('');
			// setPassword('');
			// setSecret('');

			// Update local storage, update user, keep token

			let auth = JSON.parse(localStorage.getItem('auth'));
			auth.user = data.user;
			localStorage.setItem('auth', JSON.stringify(auth));

			// Update Context
			setState({ ...state, user: data.user });

			setOk(true);
			setLoading(false);
		} catch (error) {
			// console.log(error.response.data);
			toast.error(data.error);
			setLoading(false);
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
		<div className='container-fluid'>
			<div className='row py-5 bg-default-image text-light'>
				<div className='col text-center'>
					<h1>Profile</h1>
				</div>
			</div>

			<div className='row py-5'>
				<div className='col-md-6 offset-md-3'>
					{/* Upload Image */}
					<label htmlFor='file' className='d-flex justify-content-center'>
						{image && image.url ? (
							<Avatar size={60} src={image.url} className='mt-1' />
						) : uploading ? (
							<LoadingOutlined className='mt-2' />
						) : (
							<CameraOutlined className='mt-2' />
						)}

						<input onChange={handleImage} type='file' id='file' accept='images/*' hidden />
					</label>

					<AuthForm
						profileUpdate={true}
						username={username}
						setUsername={setUsername}
						about={about}
						setAbout={setAbout}
						handleSubmit={handleSubmit}
						name={name}
						setName={setName}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						secret={secret}
						setSecret={setSecret}
						loading={loading}
					/>
				</div>
			</div>
			<div className='row'>
				<div className='col'>
					<Modal title='Congratulations!' open={ok} onCancel={() => setOk(false)} footer={null}>
						<p>You have updated your profile!</p>
					</Modal>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<p className='text-center'>
						Already registered?{' '}
						<Link href='/login' legacyBehavior>
							<a>Login</a>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
export default ProfileUpdate;
