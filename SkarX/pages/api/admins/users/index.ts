import nc from 'next-connect';
import { isAdmin } from '../../../../utils/auth';
import { getUsers } from '../../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = nc();
handler.use(isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const users = await getUsers();
		res.send(users);
	} catch (err) {
		res.status(500).send(null);
	}
});

export default handler;
