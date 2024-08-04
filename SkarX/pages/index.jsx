/* eslint-disable react/prop-types */

import { Grid, Typography } from '@material-ui/core';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import { getProducts } from '../models/Product';
//import useStyles from '../utils/styles';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home(props) {
	//const classes = useStyles();
	// eslint-disable-next-line react/prop-types
	const { products } = props;
	return (
		<Layout>
			<Typography variant="h2">Popular Products</Typography>
			<Grid container spacing={3}>
				{products.map((product) => (
					<Grid item md={4} key={product.name}>
						<ProductItem product={product} />
					</Grid>
				))}
			</Grid>
		</Layout>
	);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps() {
	try {
		const retProducts = await getProducts();
		return {
			props: {
				products: JSON.parse(JSON.stringify(retProducts)),
			},
		};
	} catch (err) {
		return {
			props: {
				products: {},
			},
		};
	}
}
