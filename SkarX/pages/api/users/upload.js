/* eslint-disable @typescript-eslint/no-explicit-any */
import nc from "next-connect";
import { isAuth} from "../../../utils/auth";
import { onError } from "../../../utils/error";
import multer from "multer";

const handler = nc({ onError });

const oneMegabyteInBytes = 1000000;
//const outputFolderName = './public/uploads';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../public/uploads");
    },
    filename: function (req, file, cb) {
        const name = req.user._id;
        cb(null, `${name}.pdf` || "temp");
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
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

// interface NextApiRequestWithFileAndUser extends NextApiRequest {
// 	file: Express.Multer.File;
// 	user: User;
// }

const isNotSellerAndAdmin = async (
	req,
	res,
	next
)=> {
	try {
		if (req.user != null && req.user.isSeller != true && req.user.isAdmin != true) {
			next();
		} else {
			res.status(401).send({ message: 'User Is Already Seller' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
};

handler
    .use(isAuth, isNotSellerAndAdmin, upload.single("file"))
    .post(
        async (
            req /*: NextApiRequestWithFileAndUser*/,
            res /*: NextApiResponse*/
        ) => {
            res.send(`/public/images/${req.user._id}`);
        }
    );

export default handler;