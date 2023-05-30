import { SyncOutlined } from '@ant-design/icons';

function AuthForm({
	handleSubmit,
	name,
	setName,
	email,
	setEmail,
	password,
	setPassword,
	secret,
	setSecret,
	loading,
	page,
	username,
	setUsername,
	about,
	setAbout,
	profileUpdate,
}) {
	return (
		<form onSubmit={handleSubmit}>
			{profileUpdate && (
				<div className='form-group p-2'>
					<small>
						<label htmlFor='' className='text-muted'>
							Username
						</label>
					</small>
					<input
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						value={username}
						type='text'
						className='form-control'
						placeholder='Enter Name'
					/>
				</div>
			)}

			{profileUpdate && (
				<div className='form-group p-2'>
					<small>
						<label htmlFor='' className='text-muted'>
							About
						</label>
					</small>
					<input
						onChange={(e) => {
							setAbout(e.target.value);
						}}
						value={about}
						type='text'
						className='form-control'
						placeholder='Describe yourself'
					/>
				</div>
			)}

			{page !== 'login' && (
				<div className='form-group p-2'>
					<small>
						<label htmlFor='' className='text-muted'>
							Your Name
						</label>
					</small>
					<input
						onChange={(e) => {
							setName(e.target.value);
						}}
						value={name}
						type='text'
						className='form-control'
						placeholder='Enter Name'
					/>
				</div>
			)}
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
					disabled={profileUpdate}
				/>
			</div>
			<div className='form-group p-2'>
				<small>
					<label htmlFor='' className='text-muted'>
						Password
					</label>
				</small>
				<input
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					value={password}
					type='password'
					className='form-control'
					placeholder='Enter Password'
				/>
			</div>
			{page !== 'login' && (
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
			)}

			<div className='form-group p-2'>
				<button
					className='btn btn-primary col-12'
					disabled={
						profileUpdate
							? loading
							: page !== 'login'
							? !name || !email || !password || !secret || loading
							: !email || !password || loading
					}>
					{loading ? <SyncOutlined spin className='py-1' /> : 'Submit'}
				</button>
			</div>
		</form>
	);
}
export default AuthForm;
