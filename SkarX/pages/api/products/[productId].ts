import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getProductById } from '../../../models/Product';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const product = await getProductById(req.query.productId);
		res.send(product);
	} catch (err) {
		res.status(500).send(null);
	}
});

export default handler;
