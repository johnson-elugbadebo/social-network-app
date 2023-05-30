import { Avatar } from 'antd';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

function PostForm({ content, setContent, postSubmit, handleImage, uploading, image }) {
	return (
		<div className='card'>
			<div className='card-body pb-3'>
				<form className='form-group' onSubmit={postSubmit}>
					<ReactQuill
						theme='snow'
						value={content}
						onChange={(e) => setContent(e)}
						className='form-control'
						placeholder='Write something...'
					/>
				</form>
			</div>

			<div className='card-footer d-flex justify-content-between'>
				<button onClick={postSubmit} className='btn btn-primary btn-sm mt-1' disabled={!content}>
					Post
				</button>

				<label htmlFor='file'>
					<span className='btn btn-primary btn-sm mt-1 me-2'>Upload Image</span>
					{image && image.url ? (
						<Avatar size={35} src={image.url} shape='square' className='mt-1' />
					) : uploading ? (
						<LoadingOutlined className='mt-2' />
					) : (
						<CameraOutlined className='mt-2' style={{ fontSize: '20px' }} />
					)}
					<input onChange={handleImage} type='file' id='file' accept='images/*' hidden />
				</label>
			</div>
		</div>
	);
}
export default PostForm;
