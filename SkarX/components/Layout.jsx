/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	Link,
	ThemeProvider,
	CssBaseline,
	Switch,
	Button,
	Menu,
	MenuItem,
	Box,
	IconButton,
	InputBase,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
// import MenuIcon from '@material-ui/icons/Menu';
// import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
// import { getError } from '../utils/error';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Layout({ title, description, children }) {
	const router = useRouter();
	const { state, dispatch } = useContext(Store);
	const { darkMode, userInfo } = state;

	const themeLight = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
			h2: {
				fontSize: '1.4rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
		},
		palette: {
			primary: {
				main: '#FFC68A',
			},
			secondary: {
				main: '#FFC68A',
			},
		},
	});

	const themeDark = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
			h2: {
				fontSize: '1.4rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
		},
		palette: {
			type: 'dark',
			background: {
				default: '#121212',
			},
			primary: {
				main: '#FFC68A',
			},
			secondary: {
				main: '#FFC68A',
			},
		},
	});

	const classes = useStyles();

	const [query, setQuery] = useState('');
	const queryChangeHandler = (e) => {
		setQuery(e.target.value);
	};
	const submitHandler = (e) => {
		e.preventDefault();
		router.push(`/search?query=${query}`);
	};

	const darkModeChangeHandler = () => {
		dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
		const newDarkMode = !darkMode;
		Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
	};
	const [anchorEl, setAnchorEl] = useState(null);
	const loginClickHandler = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const loginMenuCloseHandler = (e, redirect) => {
		setAnchorEl(null);
		if (redirect && redirect.includes('backdropClick') == false) {
			router.push(redirect);
		}
	};
	const logoutClickHandler = () => {
		setAnchorEl(null);
		dispatch({ type: 'USER_LOGOUT' });
		Cookies.remove('userInfo');
		router.push('/');
	};
	return (
		<div>
			<Head>
				<title>{title ? `${title} - SkarX` : 'SkarX'}</title>
				{description && (
					<meta name="description" content={description}></meta>
				)}
			</Head>
			<ThemeProvider theme={darkMode ? themeDark : themeLight}>
				<CssBaseline />
				<AppBar position="static" className={classes.navbar}>
					<Toolbar className={classes.toolbar}>
						<Box display="flex" alignItems="center">
							<NextLink href="/" passHref>
								<Link>
									<Typography className={classes.brand}>
										SkarX
									</Typography>
								</Link>
							</NextLink>
						</Box>

						<div className={classes.searchSection}>
							<form
								onSubmit={submitHandler}
								className={classes.searchForm}
								autoComplete="off"
							>
								<InputBase
									name="query"
									className={classes.searchInput}
									placeholder="Search products"
									onChange={queryChangeHandler}
								/>
								<IconButton
									type="submit"
									className={classes.iconButton}
									aria-label="search"
								>
									<SearchIcon />
								</IconButton>
							</form>
						</div>
						<div>
							<Switch
								checked={darkMode}
								onChange={darkModeChangeHandler}
							></Switch>

							{userInfo ? (
								<>
									<Button
										aria-controls="simple-menu"
										aria-haspopup="true"
										onClick={loginClickHandler}
										className={classes.navbarButton}
									>
										{userInfo.name}
									</Button>
									<Menu
										id="simple-menu"
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={loginMenuCloseHandler}
									>
										{userInfo.isAdmin !== true && (
											<MenuItem
												onClick={(e) =>
													loginMenuCloseHandler(
														e,
														'/users/profile'
													)
												}
											>
												Profile
											</MenuItem>
										)}
										{userInfo.isAdmin == true && (
											<MenuItem
												onClick={(e) =>
													loginMenuCloseHandler(
														e,
														'/admins/users'
													)
												}
											>
												Admin Dashboard
											</MenuItem>
										)}
										{userInfo.isSeller &&
											userInfo.isAdmin != true && (
												<MenuItem
													onClick={(e) =>
														loginMenuCloseHandler(
															e,
															'/sellers'
														)
													}
												>
													Seller Dashboard
												</MenuItem>
											)}
										<MenuItem onClick={logoutClickHandler}>
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<NextLink href="/users/login" passHref>
									<Link>
										<Typography component="span">
											Login
										</Typography>
									</Link>
								</NextLink>
							)}
						</div>
					</Toolbar>
				</AppBar>
				<Container className={classes.main}>{children}</Container>
				<footer className={classes.footer}>
					<Typography>All rights reserved. SkarX.</Typography>
				</footer>
			</ThemeProvider>
		</div>
	);
}
