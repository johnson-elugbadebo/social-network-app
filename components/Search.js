import { useState, useContext } from 'react';
import axios from 'axios';
import People from './People';
import { UserContext } from '../context/index.js';
import { toast } from 'react-toastify';

function Search() {
	const [state, setState] = useContext(UserContext);

	const [query, setQuery] = useState('');
	const [result, setResult] = useState([]);

	const searchUser = async (e) => {
		e.preventDefault();
		// console.log(`Find "${query}" f rom db`);
		try {
			const response = await axios.get(`/auth/search-user/${query}`);
			//  console.log("search user response => ", data);
			setResult(response.data.user);
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
			// Update result state to remove person we just followed
			// console.log(typeof people); people is an object
			// let newPeople = Object.values(people.people);
			let filtered = result.filter((p) => p._id !== user._id);
			setResult(filtered);
			// console.log(filtered);
			// Rerender newsfeed + Display posts of folks we are following
			// newsFeed();
			// Toast notification
			toast.success(response.data.success);
		} catch (error) {
			console.log(error);
			toast.error(response.data.error);
		}
	};

	const handleUnFollow = async function (user) {
		try {
			const response = await axios.put('/auth/user-unfollow', { _id: user._id, name: user.name });
			// console.log('Handle UnFollow Response ===>', response.data);
			// Update local storage, update user, keep token
			let auth = JSON.parse(localStorage.getItem('auth'));
			auth.user = response.data.user;
			localStorage.setItem('auth', JSON.stringify(auth));
			// Update context
			setState({ ...state, user: response.data.user });
			// Update result state to remove person we just unollowed
			// console.log(typeof people); people is an object
			// let newPeople = Object.values(people.people);
			let filtered = result.filter((p) => p._id !== user._id);
			setResult(filtered);
			// console.log(filtered);
			// Toast notification
			toast.success(response.data.success);
		} catch (error) {
			console.log(error);
			toast.error(response.data.error);
		}
	};

	return (
		<>
			<form className='form-inline row' onSubmit={searchUser}>
				<div className='col-8'>
					<input
						onChange={(e) => {
							setQuery(e.target.value);
							setResult([]);
						}}
						value={query}
						className='form-control'
						type='search'
						placeholder='Search'
					/>
				</div>
				<div className='col-4'>
					<button className='btn btn-outline-primary col-12' type='submit'>
						Search Users
					</button>
				</div>
			</form>

			{result &&
				result.map((user) => (
					<People
						key={user._id}
						people={result}
						handleFollow={handleFollow}
						handleUnFollow={handleUnFollow}
					/>
				))}
		</>
	);
}

export default Search;
