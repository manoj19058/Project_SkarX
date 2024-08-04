import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getProductsForAdmin } from '../../../../models/Product';
import { isAdmin } from '../../../../utils/auth';

const handler = nc().use(isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const products = await getProductsForAdmin();
		res.send(products);
	} catch {
		res.status(500).send(null);
	}
});

export default handler;
