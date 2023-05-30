import { SyncOutlined } from '@ant-design/icons';

function ForgotPasswordForm({
	handleSubmit,
	email,
	setEmail,
	newPassword,
	setNewPassword,
	secret,
	setSecret,
	loading,
	page,
}) {
	return (
		<form onSubmit={handleSubmit}>
			<div className='form-group p-2'>
				<small>
					<label htmlFor='' className='text-muted'>
						Email Address
					</label>
				</small>
				<input
					onChange={(e) => {
						setEmail(e.target.value);
					}}
					value={email}
					type='email'
					className='form-control'
					placeholder='Enter email'
				/>
			</div>
			<div className='form-group p-2'>
				<small>
					<label htmlFor='' className='text-muted'>
						New Password
					</label>
				</small>
				<input
					onChange={(e) => {
						setNewPassword(e.target.value);
					}}
					value={newPassword}
					type='password'
					className='form-control'
					placeholder='Enter New Password'
				/>
			</div>

			<>
				<div className='form-group p-2'>
					<small>
						<label htmlFor='' className='text-muted'>
							Pick A Question
						</label>
					</small>
					<select className='form-control'>
						<option value=''>What is your favorite color?</option>
						<option value=''>What is your best friend's name?</option>
						<option value=''>What city were you born in?</option>
					</select>
					<small className='form-text text-muted'>You can use this reset your password.</small>
				</div>

				<div className='form-group p-2'>
					<input
						onChange={(e) => {
							setSecret(e.target.value);
						}}
						value={secret}
						type='text'
						className='form-control'
						placeholder='Write your answer here'
						id=''
					/>
				</div>
			</>

			<div className='form-group p-2'>
				<button
					className='btn btn-primary col-12'
					disabled={!email || !newPassword || !secret || loading}>
					{loading ? <SyncOutlined spin className='py-1' /> : 'Submit'}
				</button>
			</div>
		</form>
	);
}
export default ForgotPasswordForm;
