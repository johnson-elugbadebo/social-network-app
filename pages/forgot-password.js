import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import Link from 'next/link';
import ForgotPasswordForm from '../components/ForgotPasswordForm.js';
import { UserContext } from '../context/index.js';
import { useRouter } from 'next/router';

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [secret, setSecret] = useState('');
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	const [state] = useContext(UserContext);
	const router = useRouter();

	const handleSubmit = async function (e) {
		e.preventDefault();
		const userInfo = {
			email: email,
			newPassword: newPassword,
			secret: secret,
		};

		try {
			setLoading(true);
			// Don't need "/api/v1" in endpoint because of axios config baseURL
			const response = await axios.post('/auth/forgot-password', userInfo);

			console.log(response);

			setEmail('');
			setNewPassword('');
			setSecret('');
			setOk(response.data ? true : false);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	if (state && state.token) router.push('/');

	return (
		<div className='container-fluid'>
			<div className='row py-5 bg-default-image text-light'>
				<div className='col text-center'>
					<h1>Forgot Password</h1>
				</div>
			</div>

			<div className='row py-5'>
				<div className='col-md-6 offset-md-3'>
					<ForgotPasswordForm
						handleSubmit={handleSubmit}
						email={email}
						setEmail={setEmail}
						newPassword={newPassword}
						setNewPassword={setNewPassword}
						secret={secret}
						setSecret={setSecret}
						loading={loading}
					/>
				</div>
			</div>
			<div className='row'>
				<div className='col'>
					<Modal title='Congratulations!' open={ok} onCancel={() => setOk(false)} footer={null}>
						<p>You can now login with a new password.</p>
						<Link href='/login' legacyBehavior>
							<a className='btn btn-primary btn-sm'>Login</a>
						</Link>
					</Modal>
				</div>
			</div>
		</div>
	);
}
export default ForgotPassword;
