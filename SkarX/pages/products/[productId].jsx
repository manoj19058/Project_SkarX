/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
//import { useRouter } from 'next/router';
import NextLink from "next/link";
//import Image from 'next/image';
import Image from "material-ui-image";
import {
    Grid,
    Link,
    List,
    ListItem,
    Typography,
    Card,
    Button,
} from "@material-ui/core";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";
import copy from "copy-to-clipboard";
import { useSnackbar } from "notistack";
import { ShareRounded } from "@material-ui/icons";
//import Slide from '@material-ui/core/Slide';
import dynamic from "next/dynamic";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { Store } from "../../utils/Store";
import { getProductById } from "../../models/Product";
const Carousel = dynamic(() => import("react-material-ui-carousel"), {
    ssr: false,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ProductScreen(props) {
    const { product } = props;
    //const router = useRouter();
    const classes = useStyles();
    //const { productId } = router.query;
    const { enqueueSnackbar } = useSnackbar();
    //const { quantity, setQuantity } = useState(1);
    const { state } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    //const [product, setProduct] = useState({});
    //console.log('ID' + productId);

    //console.log('Product: ' + product);

    // useEffect(()=> {

    // }, []);
    useEffect(() => {
        if (!userInfo) router.push("/users/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!product) {
        return <div>Product Not Found</div>;
    }
    const purchaseHandler = async (paymentInfo) => {
        try {
            const productId = product._id;
            await axios.post(
                "/api/payment",
                {
                    productId,
                    paymentInfo,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            enqueueSnackbar("Successful", {
                variant: "success",
            });
        } catch (err) {
            enqueueSnackbar("Unsuccessful", {
                variant: "error",
            });
        }
    };

    // const updateQuantityHandler = async (item, quantity) => {
    // 	const { data } = await axios.get(`/api/products/${item._id}`);
    // 	if (data.stock < quantity) {
    // 		enqueueSnackbar('Sorry. Product is out of Stock!', {
    // 			variant: 'error',
    // 			anchorOrigin: {
    // 				vertical: 'left',
    // 				horizontal: 'left',
    // 			},
    // 			TransitionComponent: Slide,
    // 		});
    // 		return;
    // 	}
    // 	setQuantity(quantity);
    // };

    const CopyToClipboard = async () => {
        const data = window.location.href;
        copy(data);
        enqueueSnackbar("Copied To Clipboard !", {
            variant: "success",
        });
    };

    return (
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>
                        <Typography>Back to products</Typography>
                    </Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Carousel animation="slide">
                        <Image
                            src={`/images/${product._id}_0.jpg`}
                            alt={product.name}
                            imageStyle={{ width: 640, height: 612 }}
                        ></Image>
                        <Image
                            src={`/images/${product._id}_1.jpg`}
                            alt={product.name}
                            imageStyle={{ width: 640, height: 612 }}
                        ></Image>
                    </Carousel>
                </Grid>
                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography component="h1" variant="h1">
                                {product.name}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                Category: {product.category}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Brand: {product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                {" "}
                                Description: {product.description}
                            </Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Price</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            ₹{product.price}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Status</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            {product.stock > 0
                                                ? "In stock"
                                                : "Unavailable"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                {userInfo != null && (
                                    <ListItem>
                                        <StripeCheckout
                                            name={product.name}
                                            amount={product.price * 100}
                                            currency="INR"
                                            shippingAddress={true}
                                            billingAddress={true}
                                            zipCode={true}
                                            locale="auto"
                                            email={userInfo.email}
                                            stripeKey={
                                                process.env
                                                    .REACT_APP_STRIPE_PUBLIC_KEY
                                            }
                                            token={(paymentInfo) =>
                                                purchaseHandler(paymentInfo)
                                            }
                                        >
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                            >
                                                Buy Now
                                            </Button>
                                        </StripeCheckout>
                                    </ListItem>
                                )}
                                <ListItem>
                                    <Button
                                        fullWidth
                                        color="primary"
                                        onClick={CopyToClipboard}
                                    >
                                        Share
                                        <ShareRounded />
                                    </Button>
                                </ListItem>
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
    const { productId } = params;
    const data = await getProductById(productId);
    return {
        props: {
            product: data,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });
