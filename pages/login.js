import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import Link from 'next/link';
import AuthForm from '../components/AuthForm.js';
import { useRouter } from 'next/router';
import { UserContext } from '../context/index.js';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const [state, setState] = useContext(UserContext);

	const router = useRouter();

	const handleSubmit = async function (e) {
		e.preventDefault();
		const userInfo = {
			email: email,
			password: password,
		};

		try {
			setLoading(true);
			// Don't need "/api/v1" in endpoint because of axios config baseURL
			const response = await axios.post('/auth/login', userInfo);
			// console.log(response);

			// if (data.status === 201) {
			// 	setOk(!ok);
			// }
			setEmail('');
			setPassword('');
			setLoading(false);
			// console.log(response);
			// router.push('/');

			// Update Global Context
			setState({
				user: response.data.user,
				token: response.data.token,
			});

			// Save in Local Storage
			window.localStorage.setItem('auth', JSON.stringify(response.data));

			router.push('/user/dashboard');
		} catch (error) {
			// console.log(error.response.data);
			setLoading(false);
			toast.error(error.response);
		}
	};

	if (state && state.token) router.push('/user/dashboard');

	return (
		<div className='container-fluid'>
			<div className='row py-5 bg-default-image text-light'>
				<div className='col text-center'>
					<h1>Login Page</h1>
				</div>
			</div>

			<div className='row py-5'>
				<div className='col-md-6 offset-md-3'>
					<AuthForm
						handleSubmit={handleSubmit}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						loading={loading}
						page='login'
					/>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<p className='text-center'>
						Not yet registered?{' '}
						<Link href='/register' legacyBehavior>
							<a>Register</a>
						</Link>
					</p>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<p className='text-center'>
						<Link href='/forgot-password' legacyBehavior>
							<a className='text-danger'>Forgot Password</a>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
export default Login;
