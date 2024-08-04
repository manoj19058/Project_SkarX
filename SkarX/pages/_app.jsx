/* eslint-disable react/prop-types */
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);
	return (
		<SnackbarProvider
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<StoreProvider>
				<Component {...pageProps} />
			</StoreProvider>
		</SnackbarProvider>
	);
}

export default MyApp;

// Line 16 Stripe needed
