import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
	CircularProgress,
	Grid,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	ListItemText,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { useSnackbar } from 'notistack';
//import Slide from '@material-ui/core/Slide';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				users: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };

		case 'DELETE_REQUEST':
			return { ...state, loadingDelete: true };
		case 'DELETE_SUCCESS':
			return { ...state, loadingDelete: false, successDelete: true };
		case 'DELETE_FAIL':
			return { ...state, loadingDelete: false };
		case 'DELETE_RESET':
			return { ...state, loadingDelete: false, successDelete: false };
		default:
			state;
	}
}

function AdminUsers() {
	const { state } = useContext(Store);
	const router = useRouter();
	const classes = useStyles();
	const { userInfo } = state;
	//if (!userInfo) router.push('/users/login');
	const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
		useReducer(reducer, {
			loading: true,
			users: [],
			error: '',
		});

	useEffect(() => {
		if (!userInfo) {
			router.push('/users/login');
		}
		if (userInfo.isAdmin != true) router.push('/');
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/admins/users`, {
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		if (successDelete) {
			dispatch({ type: 'DELETE_RESET' });
		} else {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [successDelete]);

	const { enqueueSnackbar } = useSnackbar();
	if (!userInfo) return <div>Please Login</div>;
	const deleteHandler = async (userId) => {
		if (!window.confirm('Are you sure?')) {
			return;
		}
		try {
			dispatch({ type: 'DELETE_REQUEST' });
			await axios.delete(`/api/admins/users/${userId}`, {
				headers: {
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			dispatch({ type: 'DELETE_SUCCESS' });
			enqueueSnackbar('User deleted successfully', {
				variant: 'success',
			});
		} catch (err) {
			dispatch({ type: 'DELETE_FAIL' });
			enqueueSnackbar(getError(err), {
				variant: 'error',
			});
		}
	};
	return (
		<Layout title="Users">
			<Grid container spacing={2}>
				<Grid item md={12}>
					<Card className={classes.section}>
						<List>
							<NextLink href="/admins/products" passHref>
								<ListItem button component="a">
									<ListItemText
										primary="Products"
										align="center"
									></ListItemText>
								</ListItem>
							</NextLink>
							<NextLink href="/admins/users" passHref>
								<ListItem selected button component="a">
									<ListItemText
										primary="Users"
										align="center"
									></ListItemText>
								</ListItem>
							</NextLink>
						</List>
					</Card>
				</Grid>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component="h1" variant="h1">
									Users
								</Typography>
								{loadingDelete && <CircularProgress />}
							</ListItem>

							<ListItem>
								{loading ? (
									<CircularProgress />
								) : error ? (
									<Typography className={classes.error}>
										{error}
									</Typography>
								) : (
									<TableContainer>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>ID</TableCell>
													<TableCell>NAME</TableCell>
													<TableCell>EMAIL</TableCell>
													<TableCell>
														SELLER
													</TableCell>
													<TableCell>
														ACTIONS
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{users.map((user) => (
													<TableRow key={user._id}>
														<TableCell>
															{user._id.substring(
																20,
																24
															)}
														</TableCell>
														<TableCell>
															{user.name}
														</TableCell>
														<TableCell>
															{user.email}
														</TableCell>
														<TableCell>
															{user.isSeller
																? 'YES'
																: 'NO'}
														</TableCell>
														<TableCell>
															<NextLink
																href={`/admins/users/${user._id}`}
																passHref
															>
																<Button
																	size="small"
																	variant="contained"
																	color="primary"
																>
																	Edit
																</Button>
															</NextLink>{' '}
															<Button
																onClick={() =>
																	deleteHandler(
																		user._id
																	)
																}
																size="small"
																variant="contained"
																color="primary"
															>
																Delete
															</Button>{' '}
															<NextLink
																href={`/uploads/${user._id}.pdf`}
																passHref
															>
																<Button
																	size="small"
																	variant="contained"
																	color="primary"
																>
																	Doc
																</Button>
															</NextLink>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
