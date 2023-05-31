import axios from 'axios';
import Head from 'next/head';
import Background from '../../../components/Background.js';
import PostPublic from '../../../components/PostPublic.js';

function SinglePost(props) {
	// console.log(props);

	const imageSource = function (propspost) {
		if (propspost.image) {
			return propspost.image.url;
		} else {
			return '/images/default.jpg';
		}
	};

	return (
		<>
			<Head>
				<title>MERN STACK APP -- A Social Network by Johnson Elugbadebo</title>
				<meta name='description' content={props.post.content} />
				<meta property='og:description' content='A Social Network by Johnson Elugbadebo' />
				<meta property='og:type' content='website' />
				<meta property='og:site_name' content="Johnson's Social Network" />
				<meta
					property='og:url'
					content={`http://jesocialnetwork.com/post/view/${props.post._id}`}
				/>
				<meta property='og:image:secure_url' content={imageSource(props.post)} />
			</Head>

			<Background url='/images/default.jpg'>{'JOHNSONS MERN STACK APP HOME PAGE'}</Background>
			{/* <pre>{JSON.stringify(props.posts, null, 4)}</pre> */}
			<div className='container'>
				<div className='row pt-5'>
					<div className='col-md-8 offset-md-2'>
						<PostPublic key={props.post._id} post={props.post} />
					</div>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const SystemAxios = axios.create({
		baseURL: 'http://127.0.0.1:8080/api/v1',
	});
	const response = await SystemAxios.get(`/post/render/post/${context.params._id}`);

	return {
		props: { post: response.data.post },
	};
}

export default SinglePost;
