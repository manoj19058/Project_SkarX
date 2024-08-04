import { Schema, model, models } from 'mongoose';
import db from '../utils/db';
import bcrypt from 'bcryptjs';
// 1. Create an interface representing a document in MongoDB.

export interface User {
	_id?: string;
	name?: string;
	email?: string;
	password?: string;
	isSeller?: boolean;
	isAdmin?: boolean;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
	name: { type: String, required: true },
	email: { type: String, required: true, index: true, unique: true },
	password: { type: String, required: true },
	isSeller: { type: Boolean },
	isAdmin: { type: Boolean },
});

// 3. Create a Model.
const UserModel = models.User || model<User>('User', userSchema);

export async function getUsers(): Promise<User[]> {
	await db.connect();
	const users = await UserModel.find({ isAdmin: { $ne: true } });
	await db.disconnect();
	return users;
}

// Initially the addUser sets the isSeller to false and productList[] to []. To change this use setIsSeller and setProduct.
export async function addUser(user: User): Promise<User | null> {
	await db.connect();
	if (!(await UserModel.exists({ email: user.email }))) {
		const doc = new UserModel({
			name: user.name,
			email: user.email,
			password: bcrypt.hashSync(user.password || 'password'),
		});
		const retUser = await doc.save();
		await db.disconnect();
		return retUser;
	}
	await db.disconnect();
	return null;
}

type EmailCredentials = {
	email: string;
	password: string;
};

export async function checkByEmail(
	input: EmailCredentials
): Promise<User | null> {
	await db.connect();
	const user = await UserModel.findOne({ email: input.email });
	await db.disconnect();
	if (
		user == null ||
		(user.password !== undefined &&
			bcrypt.compareSync(input.password, user.password) == false)
	)
		return null;

	return {
		_id: user._id,
		name: user.name,
		email: user.email,
		isSeller: user.isSeller,
		isAdmin: user.isAdmin,
	};
}

export async function getUserById(
	_id: string | string[]
): Promise<User | null> {
	await db.connect();
	const user = await UserModel.findOne({ _id: _id });
	await db.disconnect();
	if (user === null) return null;
	return user;
}


export async function setUser(userDetails: User): Promise<boolean> {
	await db.connect();
	const user = await UserModel.findOneAndUpdate(
		{ _id: userDetails._id },
		{
			$set: {
				email: userDetails.email,
				password: bcrypt.hashSync(userDetails.password || 'password'),
				name: userDetails.name,
				isSeller: userDetails.isSeller,
			},
		},
		{ returnOriginal: false }
	);
	await db.disconnect();
	if (user === null) return false;
	return true;
}


export async function setIsSeller(
	_id: string | string[],
	name: string,
	isSeller: boolean
): Promise<boolean> {
	await db.connect();
	const user = await UserModel.findById(_id);
	if (user) {
		user.name = name;
		user.isSeller = Boolean(isSeller);
		await user.save();
		await db.disconnect();
		return true;
	} else {
		await db.disconnect();
		return false;
	}
}

export async function removeUserById(_id: string | string[]): Promise<User> {
	const user = await UserModel.findOneAndDelete({ _id: _id });
	return user;
}

// Remove all the products if the user is seller.
// Only add will not return the user object.
