import nc from "next-connect";
import { setUser, getUserById, User } from "../../../models/User";
import { signToken, isAuth } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import {
    checkName,
    checkEmail,
    checkPassword,
} from "../../../utils/validators";

const handler = nc();
handler.use(isAuth);

interface NextApiRequestWithUser extends NextApiRequest {
    user: User;
}

export default handler.put(
    async (req: NextApiRequestWithUser, res: NextApiResponse) => {
        try {
            if (!checkName(req.body.name)) {
                res.status(401).send(null);
                return;
            }
            if (!checkEmail(req.body.email)) {
                res.status(401).send(null);
                return;
            }
            if (!checkPassword(req.body.password)) {
                res.status(401).send(null);
                return;
            }
            const temp = await setUser({
                _id: req.user._id,
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: req.body.password,
            });
            if (temp == false) res.status(500).send(null);
            else {
                const user = await getUserById(req.user._id || "ok");
                if (user === null) res.status(401).send(null);
                else {
                    const token = signToken(user);
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.MAIL || "",
                            pass: process.env.PASSWORD || "",
                        },
                    });
                    const date = new Date();
                    const mailOptions = {
                        from: {
                            name: "Skar X",
                            address: process.env.MAIL || "",
                        },
                        to: `${user.email}`,
                        subject: "Profile Changed!",
                        text: `Dear ${
                            user.name
                        }\n\nYour profile has been update on ${date.getDate()}/${
                            date.getMonth() + 1
                        }/${date.getFullYear()}.\n\nRegards,\nTeam Skar X`,
                    };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            //console.log(error);
                            res.status(401).send(null);
                            return;
                        }
                    });
                    res.send({
                        token,
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isSeller: user.isSeller,
                        isAdmin: user.isAdmin,
                    });
                }
            }
        } catch (err) {
            //console.log(err);
            res.status(500).send(null);
        }
    }
);
