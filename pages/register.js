import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import Link from 'next/link';
import AuthForm from '../components/AuthForm.js';
import { UserContext } from '../context/index.js';
import { useRouter } from 'next/router';

function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secret, setSecret] = useState('');
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	const [state] = useContext(UserContext);
	const router = useRouter();

	const handleSubmit = async function (e) {
		e.preventDefault();
		const userInfo = {
			name: name,
			email: email,
			password: password,
			secret: secret,
		};

		try {
			setLoading(true);
			// Don't need "/api/v1" in endpoint because of axios config baseURL
			const response = await axios.post('/auth/register', userInfo);
			// console.log(response.data);

			// if (data.status === 201) {
			// 	setOk(!ok);
			// }
			setName('');
			setEmail('');
			setPassword('');
			setSecret('');
			setOk(response.data ? true : false);
			setLoading(false);
		} catch (error) {
			// console.log(error.response.data);
			setLoading(false);
			toast.error(error.response);
		}
	};

	if (state && state.token) router.push('/');

	return (
		<div className='container-fluid'>
			<div className='row py-5 bg-default-image text-light'>
				<div className='col text-center'>
					<h1>Register Page</h1>
				</div>
			</div>

			<div className='row py-5'>
				<div className='col-md-6 offset-md-3'>
					<AuthForm
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
						<p>You have registered.</p>
						<Link href='/login' legacyBehavior>
							<a className='btn btn-primary btn-sm'>Login</a>
						</Link>
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
export default Register;
