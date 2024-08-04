/* eslint-disable @typescript-eslint/no-explicit-any */
import nc from "next-connect";
import { isAuth } from "../../utils/auth";
import { User } from "../../models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { getProductById, Product, setStock } from "../../models/Product";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";

const handler = nc();
handler.use(isAuth);

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "key", {
    apiVersion: "2020-08-27",
});
const readHTMLFile = function (
    path: fs.PathOrFileDescriptor,
    callback: (
        arg0: NodeJS.ErrnoException | null,
        arg1: string | undefined
    ) => void
) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
        if (err) {
            callback(err, "");
            throw err;
        } else {
            callback(null, html);
        }
    });
};

interface NextApiRequestWithUser extends NextApiRequest {
    user: User;
}

handler.post(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        const productId = req.body.productId;
        const paymentInfo = req.body.paymentInfo;
        if (req.user.name == null || req.user.name == undefined) {
            res.status(401).send({ message: "Not a valid user" });
            return;
        }
        if (productId == null) {
            res.status(502).send({ message: "Not a valid product" });
            return;
        }
        if (paymentInfo == null) {
            res.status(502).send({ message: "Unable to proceed" });
            return;
        }
        const product: Product | null = await getProductById(productId);
        if (product?.stock == undefined || product.stock == null) {
            res.status(400).send({ message: "Invalid Stock" });
            return;
        }
        if (product?.stock < 1) {
            res.status(400).send({ message: "Unavailable stock" });
            return;
        }
        if (
            product == null ||
            product.price == undefined ||
            product == undefined
        ) {
            res.status(404).send({ message: "Product Not exist" });
            return;
        }
        const prevCustomer = await stripe.customers.list({
            email: paymentInfo.email,
        });
        const isExist = prevCustomer.data.length > 0;
        let newCustomer = null;
        if (!isExist) {
            newCustomer = await stripe.customers.create({
                email: paymentInfo.email,
                source: paymentInfo.id,
            });
        }
        try {
            await stripe.charges.create(
                {
                    currency: "INR",
                    amount: product.price * 100,
                    receipt_email: paymentInfo.email,
                    description: `You made a purchase of ₹${product.price}`,
                    customer:
                        !isExist && newCustomer != null
                            ? newCustomer.id
                            : prevCustomer.data[0].id,
                },
                { idempotencyKey: v4() }
            );
        } catch (err) {
            res.status(500).send({ message: `Please Try Later` });
            return;
        }
        await setStock(productId, product.stock - 1);

        // Nodemailer
        const email: string = paymentInfo.email;
        if (email == null) {
            res.status(401).send({ message: "Reciever mail is not provided" });
            return;
        }
        const date = new Date();
        readHTMLFile(
            path.join(
                __dirname,
                "../../../../../public/emailFormat/index.html"
            ),
            function (err, html) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL || "",
                        pass: process.env.PASSWORD || "",
                    },
                });
                const template = handlebars.compile(html);
                const replacements = {
                    userName: `${req.user.name}`,
                    email: `${email}`,
                    Date: `${date.getDate()}/${
                        date.getMonth() + 1
                    }/${date.getFullYear()}`,
                    item: `${product.name}`,
                    price: `${product.price}`,
                    totalPrice: `${product.price}`,
                };
                const htmlToSend = template(replacements);
                const mailOptions = {
                    from: {
                        name: "SkarX",
                        address: process.env.MAIL || "",
                    },
                    to: `${email}`,
                    subject: "Invoice",
                    attachments: [
                        {
                            filename: "logo.png",
                            path: path.join(
                                __dirname,
                                "../../../../../public/emailFormat/images/logo.png"
                            ),
                            cid: "logo",
                        },
                    ],

                    html: htmlToSend,
                };
                transporter.sendMail(
                    mailOptions,
                    function (error: any /*info: any*/) {
                        if (error) {
                            //console.log(error);
                            res.status(401).send({
                                message: `Unable to send mail`,
                            });
                            return;
                        } else {
                            res.status(200).send({
                                message: "Successful Purchase",
                            });
                        }
                    }
                );
            }
        );
    } catch (err) {
        res.status(500).send({ message: `Internal Server Error` });
    }
});
export default handler;
