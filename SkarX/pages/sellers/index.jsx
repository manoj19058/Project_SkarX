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
	//ListItemText,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
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
				products: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'CREATE_REQUEST':
			return { ...state, loadingCreate: true };
		case 'CREATE_SUCCESS':
			return { ...state, loadingCreate: false };
		case 'CREATE_FAIL':
			return { ...state, loadingCreate: false };
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

function SellerDashboard() {
	const { state } = useContext(Store);
	const router = useRouter();
	const classes = useStyles();
	const { userInfo } = state;
	const [
		{
			loading,
			error,
			products,
			loadingCreate,
			successDelete,
			loadingDelete,
		},
		dispatch,
	] = useReducer(reducer, {
		loading: true,
		products: [],
		error: '',
	});
	useEffect(() => {
		if (!userInfo) {
			router.push('/users/login');
		}
		if (userInfo.isAdmin == true || userInfo.isSeller != true)
			router.push('/');
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/sellers/products`, {
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
	const createHandler = async () => {
		if (!window.confirm('Are you sure?')) {
			return;
		}
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const { data } = await axios.post(
				`/api/sellers/products`,
				{},
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			//console.log(data);
			dispatch({ type: 'CREATE_SUCCESS' });
			enqueueSnackbar('Product created successfully', {
				variant: 'success',
			});
			router.push(`/sellers/products/${data.product._id}`);
		} catch (err) {
			dispatch({ type: 'CREATE_FAIL' });
			enqueueSnackbar(getError(err), {
				variant: 'error',
			});
		}
	};
	const deleteHandler = async (productId) => {
		if (!window.confirm('Are you sure?')) {
			return;
		}
		try {
			dispatch({ type: 'DELETE_REQUEST' });
			await axios.delete(`/api/sellers/products/${productId}`, {
				headers: {
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			dispatch({ type: 'DELETE_SUCCESS' });
			enqueueSnackbar('Product deleted successfully', {
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
		<Layout title="Inventory">
			<Grid container spacing={2}>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Grid container alignItems="center">
									<Grid item xs={6}>
										<Typography component="h1" variant="h1">
											Inventory
										</Typography>
										{loadingDelete && <CircularProgress />}
									</Grid>
									<Grid align="right" item xs={6}>
										<Button
											onClick={createHandler}
											color="secondary"
											variant="contained"
										>
											Create
										</Button>
										{loadingCreate && <CircularProgress />}
									</Grid>
								</Grid>
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
													<TableCell>PRICE</TableCell>
													<TableCell>
														CATEGORY
													</TableCell>
													<TableCell>BRAND</TableCell>
													<TableCell>STOCK</TableCell>
													<TableCell>
														ACTIONS
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{products.map((product) => (
													<TableRow key={product._id}>
														<TableCell>
															{product._id.substring(
																20,
																24
															)}
														</TableCell>
														<TableCell>
															{product.name}
														</TableCell>
														<TableCell>
															₹{product.price}
														</TableCell>
														<TableCell>
															{product.category}
														</TableCell>
														<TableCell>
															{product.brand}
														</TableCell>
														<TableCell>
															{product.stock}
														</TableCell>
														<TableCell>
															<NextLink
																href={`/sellers/products/${product._id}`}
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
																		product._id
																	)
																}
																size="small"
																variant="contained"
																color="primary"
															>
																Delete
															</Button>
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

export default dynamic(() => Promise.resolve(SellerDashboard), { ssr: false });
