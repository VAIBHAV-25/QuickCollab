// Copyright 2019-2025 @VAIBHAV-25 authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Html, Main, NextScript, Head } from 'next/document';

const document = () => (
	<Html>
		<Head>
			<link
				rel='preconnect'
				href='https://fonts.googleapis.com'
			/>
			<link
				rel='preconnect'
				href='https://fonts.gstatic.com'
				crossOrigin='allow'
			/>
			<link
				href='https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;800;900&display=swap'
				rel='stylesheet'
			/>
		</Head>
		<body>
			<div id='portal'></div>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default document;
