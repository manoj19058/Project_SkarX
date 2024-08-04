/* eslint-disable @typescript-eslint/no-explicit-any */
import nc from "next-connect";
import { isAuth, isSeller } from "../../../utils/auth";
import { onError } from "../../../utils/error";
import multer from "multer";
import { checkProductSeller } from "../../../models/Product";

const handler = nc({ onError });

const oneMegabyteInBytes = 1000000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../public/images");
    },
    filename: function (req, file, cb) {
        const name = req.query.productId;
        const index = req.query.index;
        cb(null, `${name}_${index}.jpg` || "temp");
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("File type not supported"), false);
    }
};
export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: oneMegabyteInBytes * 5 },
});

async function checkSameSeller(req, res, next) {
    try {
        const check = await checkProductSeller(
            req.user._id,
            req.query.productId
        );
        if (check == false) {
            res.status(401).send({ message: "Not your product" });
            return;
        }
        next();
    } catch (err) {
        res.status(500).send("Server Error");
    }
}

handler
    .use(isAuth, isSeller, checkSameSeller, upload.single("file"))
    .post(
        async (
            req /*: NextApiRequestWithFileAndUser*/,
            res /*: NextApiResponse*/
        ) => {
            res.send(`/public/images/${req.user._id}`);
        }
    );

export default handler;
