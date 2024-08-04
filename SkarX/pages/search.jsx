/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import {
	Box,
	Button,
	Grid,
	List,
	ListItem,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useRouter } from 'next/router';
import React /*{ useContext }*/ from 'react';
import Layout from '../components/Layout';
import {
	getBrands,
	getCategories,
	getCount,
	//	getProducts,
	getProductsWithFilters,
} from '../models/Product';
import useStyles from '../utils/styles';
import ProductItem from '../components/ProductItem';
//import { Store } from '../utils/Store';
//import axios from 'axios';
//import Rating from '@material-ui/lab/Rating';
import { Pagination } from '@material-ui/lab';

const PAGE_SIZE = 3;

const prices = [
	{
		name: '₹1 to ₹10000',
		value: '1-10000',
	},
	{
		name: '₹10001 to ₹100000',
		value: '10001-100000',
	},
	{
		name: '₹100001 to ₹1000000',
		value: '100001-1000000',
	},
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Search(props) {
	const classes = useStyles();
	const router = useRouter();
	if(props!=null && props.serverError==true) {
		return <div>Server Error, Please Try Again Later.</div>;
	}
	const {
		query = 'all',
		category = 'all',
		brand = 'all',
		price = 'all',
		sort = 'featured',
	} = router.query;
	const { products, countProducts, categories, brands, pages } = props;

	const filterSearch = ({
		page,
		category,
		brand,
		sort,
		min,
		max,
		searchQuery,
		price,
	}) => {
		const path = router.pathname;
		const { query } = router;
		if (page) query.page = page;
		if (searchQuery) query.searchQuery = searchQuery;
		if (sort) query.sort = sort;
		if (category) query.category = category;
		if (brand) query.brand = brand;
		if (price) query.price = price;
		if (min) query.min ? query.min : query.min === 0 ? 0 : min;
		if (max) query.max ? query.max : query.max === 0 ? 0 : max;

		router.push({
			pathname: path,
			query: query,
		});
	};
	const categoryHandler = (e) => {
		filterSearch({ category: e.target.value });
	};
	const pageHandler = (e, page) => {
		filterSearch({ page });
	};
	const brandHandler = (e) => {
		filterSearch({ brand: e.target.value });
	};
	const sortHandler = (e) => {
		filterSearch({ sort: e.target.value });
	};
	const priceHandler = (e) => {
		filterSearch({ price: e.target.value });
	};

	//const { state, dispatch } = useContext(Store);
	return (
		<Layout title="Search">
			<Grid className={classes.mt1} container spacing={1}>
				<Grid item md={3}>
					<List>
						<ListItem>
							<Box className={classes.fullWidth}>
								<Typography>Categories</Typography>
								<Select
									fullWidth
									value={category}
									onChange={categoryHandler}
								>
									<MenuItem value="all">All</MenuItem>
									{categories &&
										categories.map((category) => (
											<MenuItem
												key={category}
												value={category}
											>
												{category}
											</MenuItem>
										))}
								</Select>
							</Box>
						</ListItem>
						<ListItem>
							<Box className={classes.fullWidth}>
								<Typography>Brands</Typography>
								<Select
									value={brand}
									onChange={brandHandler}
									fullWidth
								>
									<MenuItem value="all">All</MenuItem>
									{brands &&
										brands.map((brand) => (
											<MenuItem key={brand} value={brand}>
												{brand}
											</MenuItem>
										))}
								</Select>
							</Box>
						</ListItem>
						<ListItem>
							<Box className={classes.fullWidth}>
								<Typography>Prices</Typography>
								<Select
									value={price}
									onChange={priceHandler}
									fullWidth
								>
									<MenuItem value="all">All</MenuItem>
									{prices.map((price) => (
										<MenuItem
											key={price.value}
											value={price.value}
										>
											{price.name}
										</MenuItem>
									))}
								</Select>
							</Box>
						</ListItem>
					</List>
				</Grid>
				<Grid item md={9}>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Grid item>
							{products.length === 0 ? 'No' : countProducts}{' '}
							Results
							{query !== 'all' && query !== '' && ' : ' + query}
							{category !== 'all' && ' : ' + category}
							{brand !== 'all' && ' : ' + brand}
							{price !== 'all' && ' : Price ' + price}
							{(query !== 'all' && query !== '') ||
							category !== 'all' ||
							brand !== 'all' ||
							price !== 'all' ? (
								<Button onClick={() => router.push('/search')}>
									<CancelIcon />
								</Button>
							) : null}
						</Grid>
						<Grid item>
							<Typography
								component="span"
								className={classes.sort}
							>
								Sort by
							</Typography>
							<Select value={sort} onChange={sortHandler}>
								<MenuItem value="lowest">
									Price: Low to High
								</MenuItem>
								<MenuItem value="highest">
									Price: High to Low
								</MenuItem>
							</Select>
						</Grid>
					</Grid>
					<Grid className={classes.mt1} container spacing={3}>
						{products.map((product) => (
							<Grid item md={4} key={product.name}>
								<ProductItem product={product} />
							</Grid>
						))}
					</Grid>
					<Pagination
						className={classes.mt1}
						defaultPage={parseInt(query.page || '1')}
						count={pages}
						onChange={pageHandler}
					></Pagination>
				</Grid>
			</Grid>
		</Layout>
	);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps({ query }) {
	try {
		const pageSize = query.pageSize || PAGE_SIZE;
		const page = query.page || 1;
		const category = query.category || '';
		const brand = query.brand || '';
		const price = query.price || '';
		const sort = query.sort || '';
		const searchQuery = query.query || '';

		const queryFilter =
			searchQuery && searchQuery !== 'all'
				? {
						name: {
							$regex: searchQuery,
							$options: 'i',
						},
				  }
				: {};
		const categoryFilter =
			category && category !== 'all' ? { category } : {};
		const brandFilter = brand && brand !== 'all' ? { brand } : {};
		// 10-50
		const priceFilter =
			price && price !== 'all'
				? {
						price: {
							$gte: Number(price.split('-')[0]),
							$lte: Number(price.split('-')[1]),
						},
				  }
				: {};

		const order =
			sort === 'featured'
				? { featured: -1 }
				: sort === 'lowest'
				? { price: 1 }
				: sort === 'highest'
				? { price: -1 }
				: sort === 'newest'
				? { createdAt: -1 }
				: { _id: -1 };

		const categories = await getCategories();
		//console.log('Hello ' + categories);
		const brands = await getBrands();
		//console.log('Hello ' + brands);
		let products = await getProductsWithFilters(
			{
				...queryFilter,
				...categoryFilter,
				...priceFilter,
				...brandFilter,
			},
			order,
			pageSize,
			page
		);
		products = JSON.parse(JSON.stringify(products));
		//console.log('Hello ' + productDocs[0]);
		//let products = productDocs.map(db.convertDocToObj);
		const countProducts = await getCount({
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...brandFilter,
		});

		return {
			props: {
				products,
				countProducts,
				page,
				pages: Math.ceil(countProducts / pageSize),
				categories,
				brands,
			},
		};
	} catch (err) {
		return {
			props: {
				serverError: true,
			},
		};
	}
}
