import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { NextApiRequest, NextApiResponse } from 'next';

function signToken(user: User): string {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isSeller: user.isSeller,
			isAdmin: user.isAdmin,
		},
		process.env.JWT_SECRET || '',
		{
			expiresIn: '2h',
		}
	);
}

interface NextApiRequestWithUser extends NextApiRequest {
	user: User | undefined | JwtPayload;
}

async function isAuth(
	req: NextApiRequestWithUser,
	res: NextApiResponse,
	next: () => void
): Promise<void> {
	try {
		const { authorization } = req.headers;
		if (authorization) {
			const token = authorization.slice(7, authorization.length);
			jwt.verify(token, process.env.JWT_SECRET || '', (err, decode) => {
				if (err || decode == null) {
					res.status(401).send({
						message: 'Invalid Token, Please Login Again',
					});
				} else {
					req.user = decode;
					if (decode.isAdmin === true) {
						res.status(401).send({
							message: 'Fun Fact: Admins Are Not Gods',
						});
						return;
					}
					next();
				}
			});
		} else {
			res.status(401).send({ message: 'Token Not Supplied' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
}

const isAdmin = async (
	req: NextApiRequestWithUser,
	res: NextApiResponse,
	next: () => void
): Promise<void> => {
	try {
		const { authorization } = req.headers;
		if (authorization) {
			const token = authorization.slice(7, authorization.length);
			jwt.verify(token, process.env.JWT_SECRET || '', (err, decode) => {
				if (err || decode == null) {
					res.status(401).send({
						message: 'Invalid Token, Please Login Again',
					});
				} else {
					req.user = decode;
					if (decode.isAdmin !== true) {
						res.status(401).send({ message: 'User Is Not Admin' });
						return;
					}
					next();
				}
			});
		} else {
			res.status(401).send({ message: 'User Is Not Admin' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
};

const isSeller = async (
	req: NextApiRequestWithUser,
	res: NextApiResponse,
	next: () => void
): Promise<void> => {
	try {
		if (req.user != null && req.user.isSeller === true) {
			next();
		} else {
			res.status(401).send({ message: 'User Is Not Seller' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
};

export { signToken, isAuth, isAdmin, isSeller };
