import nc from 'next-connect';
import { getCategories } from '../../../models/Product';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const categories = await getCategories();
		res.send(categories);
	} catch (err) {
		res.status(500).send(null);
	}
});

export default handler;
