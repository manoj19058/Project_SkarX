import nc from 'next-connect';
import { isAdmin} from '../../../../utils/auth';
import { getUserById, removeUserById } from '../../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User, setIsSeller } from '../../../../models/User';

const handler = nc();
handler.use(isAdmin);

interface NextApiRequestWithUser extends NextApiRequest {
	user: User;
}

handler.put(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	try {
		const temp = await setIsSeller(
			req.query.userId,
			req.body.name,
			req.body.isSeller
		);
		if (temp === true) res.send({ message: 'User Updated Successfully' });
		else res.status(404).send({ message: 'User Not Found' });
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const user = await getUserById(req.query.userId);
		res.send(user);
	} catch (err) {
		res.status(500).send(null);
	}
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const temp = await removeUserById(req.query.userId);
		if (temp === true) {
			res.send({ message: 'User Deleted' });
		} else {
			res.status(404).send({ message: 'User Not Found' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
});

export default handler;