import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { removeProductById } from '../../../../models/Product';
import { isAdmin } from '../../../../utils/auth';

const handler = nc();
handler.use(isAdmin);

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const product = await removeProductById(req.query.productId);
		if (product === null)
			res.status(404).send({ message: 'Product Not Found' });
		else {
			res.send({ message: 'Product Deleted' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
});

export default handler;
