import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { addProduct, getProductsByUser } from '../../../../models/Product';
import { User } from '../../../../models/User';
import { isAuth, isSeller } from '../../../../utils/auth';

const handler = nc().use(isAuth, isSeller);

interface NextApiRequestWithUser extends NextApiRequest {
	user: User;
}

handler.get(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	try {
		const products = await getProductsByUser(req.user._id);
		res.send(products);
	} catch {
		res.status(500).send(null);
	}
});

handler.post(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	try {
		const product = await addProduct({
			userId: req.user._id,
			name: 'Name',
			category: 'All',
			price: 0,
			stock: 0,
			description: 'None',
			brand: 'None',
		});
		res.send({ message: 'Product Created', product: product });
	} catch (err) {
		res.status(500).send({ message: 'Server Error', product: null });
	}
});

export default handler;
