import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { User } from "../../../../models/User";
import {
    checkProductSeller,
    getProductById,
    removeProductById,
    setProduct,
} from "../../../../models/Product";
import { isSeller, isAuth } from "../../../../utils/auth";
import {
    checkProductName,
    checkNumber,
    checkDescription,
    checkNonSpaceString,
} from "../../../../utils/validators";
const handler = nc();
handler.use(isAuth, isSeller);

interface NextApiRequestWithUser extends NextApiRequest {
    user: User;
}

handler.put(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        const check = await checkProductSeller(
            req.user._id,
            req.query.productId
        );
        if (check == false) {
            res.status(401).send({ message: "Not your product" });
            return;
        } else if (check == null) {
            res.status(404).send({ message: "Product Not Found" });
            return;
        }
        if (!checkProductName(req.body.name)) {
            res.status(401).send({ message: "Invalid Name" });
            return;
        }
        if (!checkNumber(req.body.price, 5, 15000)) {
            res.status(401).send({ message: "Invalid Price" });
            return;
        }
        if (!checkNonSpaceString(req.body.category)) {
            res.status(401).send({ message: "Invalid Category" });
            return;
        }
        if (!checkProductName(req.body.brand)) {
            res.status(401).send({ message: "Invalid Brand" });
            return;
        }
        if (!checkNumber(req.body.stock, 5, 100)) {
            res.status(401).send({ message: "Invalid Stock" });
            return;
        }
        if (!checkDescription(req.body.description)) {
            res.status(401).send({ message: "Invalid Description" });
            return;
        }
        const product = await setProduct(
            {
                name: req.body.name.trim(),
                price: req.body.price,
                category: req.body.category.trim(),
                brand: req.body.brand.trim(),
                stock: req.body.stock,
                description: req.body.description.trim(),
                userId: req.user._id,
            },
            req.query.productId
        );

        if (product == false) {
            res.status(404).send({ message: "Product or Image Not Found" });
            return;
        }
        res.status(200).send({ message: "Product Updated Successfully" });
    } catch {
        res.status(500).send({ message: "Server Error" });
    }
});

handler.get(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        const product = await getProductById(req.query.productId);
        if (product == null) {
            res.status(404).send(null);
            return;
        }
        if (product.userId !== req.user._id) {
            res.status(401).send(null);
            return;
        }
        res.send(product);
    } catch {
        res.status(500).send(null);
    }
});

handler.delete(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        const check = await checkProductSeller(
            req.user._id,
            req.query.productId
        );
        if (check == false) {
            res.status(401).send({ message: "Not your product" });
            return;
        } else if (check == null) {
            res.status(404).send({ message: "Product Not Found" });
            return;
        }
        const product = await removeProductById(req.query.productId);
        if (product == false)
            res.status(404).send({ message: "Product Not Found" });
        else {
            res.send({ message: "Product deleted" });
        }
    } catch (err) {
        res.status(500).send({ message: "Server Error" });
    }
});

export default handler;
