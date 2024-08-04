/* eslint-disable react/prop-types */
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
} from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ProductItem({ product }) {
	return (
		<Card>
			<NextLink href={`/products/${product._id}`} passHref>
				<CardActionArea>
					<CardMedia
						component="img"
						image={`/images/${product._id}_0.jpg`}
						title={product.name}
						height={295.667}
						width={295.667}
					></CardMedia>
					<CardContent>
						<Typography>{product.name}</Typography>
					</CardContent>
				</CardActionArea>
			</NextLink>
			<CardActions>
				<Typography>₹{product.price}</Typography>
			</CardActions>
		</Card>
	);
}
