import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel='stylesheet' href='/css/styles.css' />
			</Head>
			<body>
				<Main />
				<NextScript />
				<script
					src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js'
					integrity='sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe'
					crossOrigin='anonymous'></script>
			</body>
		</Html>
	);
}
