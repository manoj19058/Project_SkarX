import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
	Grid,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	ListItemText,
	TextField,
	CircularProgress,
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
//import Slide from '@material-ui/core/Slide';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, error: '' };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true, errorUpdate: '' };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false, errorUpdate: '' };
		case 'UPDATE_FAIL':
			return {
				...state,
				loadingUpdate: false,
				errorUpdate: action.payload,
			};

		default:
			return state;
	}
}

function UserEdit() {
	const { state } = useContext(Store);
	const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
	});
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm();
	const [isSeller, setIsSeller] = useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();
	const { userId } = router.query;
	const classes = useStyles();
	const { userInfo } = state;
	//if (!userInfo) router.push('/users/login');

	useEffect(() => {
		if (!userInfo || userInfo.isAdmin != true) {
			return router.push('/users/login');
		} else {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(
						`/api/admins/users/${userId}`,
						{
							headers: {
								authorization: `Bearer ${userInfo.token}`,
							},
						}
					);
					setIsSeller(data.isSeller);
					dispatch({ type: 'FETCH_SUCCESS' });
					setValue('name', data.name);
				} catch (err) {
					dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
				}
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!userInfo) return <div>Please Login</div>;
	const submitHandler = async ({ name }) => {
		closeSnackbar();
		try {
			dispatch({ type: 'UPDATE_REQUEST' });
			await axios.put(
				`/api/admins/users/${userId}`,
				{
					name,
					isSeller,
				},
				{ headers: { authorization: `Bearer ${userInfo.token}` } }
			);
			dispatch({ type: 'UPDATE_SUCCESS' });
			enqueueSnackbar('User updated successfully', {
				variant: 'success',
			});
			router.push('/admins/users');
		} catch (err) {
			dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
			enqueueSnackbar(getError(err), {
				variant: 'error',
			});
		}
	};
	return (
		<Layout title={`Edit User ${userId}`}>
			<Grid container spacing={1}>
				<Grid item md={3} xs={12}>
					<Card className={classes.section}>
						<List>
							<NextLink href="/admins/products" passHref>
								<ListItem button component="a">
									<ListItemText primary="Products"></ListItemText>
								</ListItem>
							</NextLink>
							<NextLink href="/admins/users" passHref>
								<ListItem selected button component="a">
									<ListItemText primary="Users"></ListItemText>
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
									Edit User {userId}
								</Typography>
							</ListItem>
							<ListItem>
								{loading && (
									<CircularProgress></CircularProgress>
								)}
								{error && (
									<Typography className={classes.error}>
										{error}
									</Typography>
								)}
							</ListItem>
							<ListItem>
								<form
									onSubmit={handleSubmit(submitHandler)}
									className={classes.form}
									autoComplete="off"
								>
									<List>
										<ListItem>
											<Controller
												name="name"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="name"
														label="Name"
														error={Boolean(
															errors.name
														)}
														helperText={
															errors.name
																? 'Name is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<FormControlLabel
												label="Is Seller"
												control={
													<Checkbox
														onClick={(e) =>
															setIsSeller(
																e.target.checked
															)
														}
														checked={isSeller}
														name="isSeller"
													/>
												}
											></FormControlLabel>
										</ListItem>
										<ListItem>
											<Button
												variant="contained"
												type="submit"
												fullWidth
												color="primary"
											>
												Update
											</Button>
											{loadingUpdate && (
												<CircularProgress />
											)}
										</ListItem>
									</List>
								</form>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps({ params }) {
	return {
		props: { params },
	};
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
