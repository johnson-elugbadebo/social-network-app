function Background({ url, children }) {
	return (
		<div
			className='container-fluid'
			style={{
				backgroundImage: 'url( ' + url + ')',
				backgroundAttachment: 'fixed',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				padding: '0px 0px 0px 0px',
			}}>
			<h1
				className='display-3 font-weight-bold text-center'
				style={{
					padding: '45px 0px 45px 0px',
				}}>
				{children}
			</h1>
		</div>
	);
}
export default Background;
