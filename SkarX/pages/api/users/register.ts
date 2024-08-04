import nc from "next-connect";
import { signToken } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { addUser } from "../../../models/User";
import {
    checkEmail,
    checkName,
    checkPassword,
} from "../../../utils/validators";
const handler = nc();

export default handler.post(
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            if (!checkName(req.body.name)) {
                res.status(401).send({ message: "Invalid Name" });
                return;
            }
            if (!checkEmail(req.body.email)) {
                res.status(401).send({ message: "Invalid Email" });
                return;
            }
            if (!checkPassword(req.body.password)) {
                res.status(401).send({ message: "Invalid Password" });
                return;
            }
            const user = await addUser({
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: req.body.password,
            });
            if (user === null) {
                res.status(403).send(null);
            } else {
                const token = signToken(user);
                res.send({
                    token,
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isSeller: user.isSeller,
                });
            }
        } catch (err) {
            res.status(500).send(null);
        }
    }
);
