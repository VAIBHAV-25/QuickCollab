// Copyright 2019-2025 @VAIBHAV-25 authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import '../common/styles/global.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

import ModalManager from '@/common/components/modal/components/ModalManager';

import 'react-toastify/dist/ReactToastify.min.css';

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<title>Collabio | Online Whiteboard</title>
				<link
					rel='icon'
					href='/favicon.ico'
				/>
			</Head>
			<RecoilRoot>
				<ToastContainer />
				<ModalManager />
				<Component {...pageProps} />
			</RecoilRoot>
		</>
	);
};

export default App;
