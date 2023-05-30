import { useContext } from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import parse from 'html-react-parser';
import PostImage from './PostImage';
import {
	HeartOutlined,
	HeartFilled,
	CommentOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import { UserContext } from '../context/index.js';
import { useRouter } from 'next/router';
import { imageSource } from '../utils/index.js';
import Link from 'next/link';

function Post({
	post,
	handleDelete,
	handleLike,
	handleUnLike,
	handleComment,
	commentsCount = 10,
	removeComment,
}) {
	const [state] = useContext(UserContext);
	const router = useRouter();

	return (
		<>
			{post && post.postedBy && (
				<div className='card mb-5'>
					<div className='card-header'>
						{/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar>{' '} */}
						<Avatar size={40} src={imageSource(post.postedBy)} />{' '}
						<span className='pt-2 ml-3' style={{ marginLeft: '10px' }}>
							{post.postedBy.name}
						</span>{' '}
						<span className='pt-2 ml-3' style={{ marginLeft: '10px' }}>
							{moment(post.createdAt).fromNow()}
						</span>
					</div>
					<div className='card-body'>{parse(post.content)}</div>
					<div className='card-footer'>
						{post.image && <PostImage url={post.image.url} />}
						<div className='d-flex pt-2'>
							{state && state.user && post.likes && post.likes.includes(state.user._id) ? (
								<HeartFilled
									onClick={() => handleUnLike(post._id)}
									className='text-danger pt-2 h5 px-2'
								/>
							) : (
								<HeartOutlined
									onClick={() => handleLike(post._id)}
									className='text-danger pt-2 h5 px-2'
								/>
							)}
							<div className='pt-2 px-2' style={{ marginRight: '10px' }}>
								{post.likes.length} likes
							</div>
							<CommentOutlined
								onClick={() => handleComment(post)}
								className='text-danger pt-2 h5'
							/>
							<div className='pt-2 px-2'>
								<Link href={`/post/${post._id}`} legacyBehavior>
									<a>{post.comments.length} comments</a>
								</Link>
							</div>

							{state && state.user && state.user._id === post.postedBy._id && (
								<>
									<EditOutlined
										onClick={() => router.push(`/user/post/${post._id}`)}
										className='text-danger pt-2 h5 mx-auto'
									/>
									<DeleteOutlined
										onClick={() => handleDelete(post)}
										className='text-danger pt-2 h5 px-2'
									/>
								</>
							)}
						</div>
					</div>
					{/* Render Comments */}
					{post.comments && post.comments.length > 0 && (
						<ol className='list-group' style={{ maxHeight: '125px', overflow: 'scroll' }}>
							{post.comments.slice(0, commentsCount).map((comment) => (
								<li
									key={comment._id}
									className='list-group-item d-flex justify-content-between align-items-start'>
									<div className='ms-2 me-auto'>
										<div className=''>
											<Avatar size={25} className='mb-1 mr-3' src={imageSource(comment.postedBy)} />
											{'  '}
											{comment.postedBy.name}
										</div>
										<div className=''>{comment.text}</div>
									</div>
									<span className='badge rounded-pill text-muted'>
										{moment(comment.created).fromNow()}
										{state && state.user && state.user._id === comment.postedBy._id && (
											<div className='ml-auto mt-1'>
												<DeleteOutlined
													onClick={() => removeComment(post._id, comment)}
													className='pl-2 text-danger'
												/>
											</div>
										)}
									</span>
								</li>
							))}
						</ol>
					)}
				</div>
			)}
		</>
	);
}
export default Post;
