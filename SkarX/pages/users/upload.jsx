/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer /* useState */ } from 'react';
import {
	Grid,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	//	ListItemText,
	CircularProgress,
	//	FormControlLabel,
	//	Checkbox,
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
		case 'UPLOAD_REQUEST':
			return { ...state, loadingUpload: true, errorUpload: '' };
		case 'UPLOAD_SUCCESS':
			return {
				...state,
				loadingUpload: false,
				errorUpload: '',
			};
		case 'UPLOAD_FAIL':
			return {
				...state,
				loadingUpload: false,
				errorUpload: action.payload,
			};

		default:
			return state;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UploadEdit({ params }) {
	const { state } = useContext(Store);
	const [{ loadingUpload }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
	});
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();
	//const { productId } = router.query;
	const classes = useStyles();
	const { userInfo } = state;
	//if (!userInfo) router.push('/users/login');
	useEffect(() => {
		if (!userInfo) {
			return router.push('/users/login');
		}
		if (userInfo.isAdmin == true || userInfo.isSeller == true)
			router.push('/');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const uploadHandler = async (e) => {
		const file = e.target.files[0];
		const bodyFormData = new FormData();
		bodyFormData.append('file', file);
		try {
			dispatch({ type: 'UPLOAD_REQUEST' });
			await axios.post('/api/users/upload', bodyFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			dispatch({ type: 'UPLOAD_SUCCESS' });
			enqueueSnackbar('File uploaded successfully', {
				variant: 'success',
			});
		} catch (err) {
			dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
			enqueueSnackbar(getError(err), {
				variant: 'error',
			});
		}
	};
	if (!userInfo) return <div>Please Login</div>;
	return (
		<Layout title={`Upload Document`}>
			<Grid container spacing={1}>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component="h1" variant="h1">
									Upload Seller Document
								</Typography>
							</ListItem>
							<ListItem>
								<List>
									<ListItem>
										<Button
											variant="contained"
											component="label"
											color="primary"
										>
											Upload File
											<input
												type="file"
												onChange={uploadHandler}
												hidden
											/>
										</Button>
										{loadingUpload && <CircularProgress />}
									</ListItem>
								</List>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(UploadEdit), { ssr: false });
