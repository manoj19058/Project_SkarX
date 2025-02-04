/* eslint-disable no-mixed-spaces-and-tabs */
import {
	List,
	ListItem,
	Typography,
	TextField,
	Button,
	Link,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
//import Slide from '@material-ui/core/Slide';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Register() {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();
	const { redirect } = router.query;
	const { state, dispatch } = useContext(Store);
	const { userInfo } = state;
	useEffect(() => {
		if (userInfo) {
			router.push('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const classes = useStyles();
	const submitHandler = async ({
		name,
		email,
		password,
		confirmPassword,
	}) => {
		closeSnackbar();
		if (password !== confirmPassword) {
			enqueueSnackbar("Passwords don't match", {
				variant: 'error',
			});
			return;
		}
		try {
			const { data } = await axios.post('/api/users/register', {
				name,
				email,
				password,
			});
			dispatch({ type: 'USER_LOGIN', payload: data });
			Cookies.set('userInfo', data,{secure:true, sameSite:"strict"});
			router.push(redirect || '/');
		} catch (err) {
			enqueueSnackbar(getError(err), {
				variant: 'error',
			});
		}
	};
	return (
		<Layout title="Register">
			<form
				onSubmit={handleSubmit(submitHandler)}
				className={classes.form}
				autoComplete="off"
			>
				<Typography component="h1" variant="h1">
					Register
				</Typography>
				<List>
					<ListItem>
						<Controller
							name="name"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant="outlined"
									fullWidth
									id="name"
									label="Name"
									inputProps={{ type: 'name' }}
									error={Boolean(errors.name)}
									helperText={
										errors.name
											? errors.name.type === 'minLength'
												? 'Name length is more than 1'
												: 'Name is required'
											: ''
									}
									{...field}
								></TextField>
							)}
						></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name="email"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								pattern:
									/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
							}}
							render={({ field }) => (
								<TextField
									variant="outlined"
									fullWidth
									id="email"
									label="Email"
									inputProps={{ type: 'email' }}
									error={Boolean(errors.email)}
									helperText={
										errors.email
											? errors.email.type === 'pattern'
												? 'Email is not valid'
												: 'Email is required'
											: ''
									}
									{...field}
								></TextField>
							)}
						></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name="password"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 8,
							}}
							render={({ field }) => (
								<TextField
									variant="outlined"
									fullWidth
									id="password"
									label="Password"
									inputProps={{ type: 'password' }}
									error={Boolean(errors.password)}
									helperText={
										errors.password
											? errors.password.type ===
											  'minLength'
												? 'Password length should be atleast 8'
												: 'Password is required'
											: ''
									}
									{...field}
								></TextField>
							)}
						></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name="confirmPassword"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 8,
							}}
							render={({ field }) => (
								<TextField
									variant="outlined"
									fullWidth
									id="confirmPassword"
									label="Confirm Password"
									inputProps={{ type: 'password' }}
									error={Boolean(errors.confirmPassword)}
									helperText={
										errors.confirmPassword
											? errors.confirmPassword.type ===
											  'minLength'
												? 'Password length should be atleast 8'
												: 'Confirm  Password is required'
											: ''
									}
									{...field}
								></TextField>
							)}
						></Controller>
					</ListItem>
					<ListItem>
						<Button
							variant="contained"
							type="submit"
							fullWidth
							color="primary"
						>
							Register
						</Button>
					</ListItem>
					<ListItem>
						Already have an account? &nbsp;
						<NextLink
							href={`/users/login?redirect=${redirect || '/'}`}
							passHref
						>
							<Link>Login</Link>
						</NextLink>
					</ListItem>
				</List>
			</form>
		</Layout>
	);
}
