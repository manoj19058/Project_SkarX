/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const next = require("next");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = false;
console.log(dev);
const app = next({ dev });
const handle = app.getRequestHandler();

async function isAdmin(req, res, next) {
    try {
        const { userInfo } = req.cookies;
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            jwt.verify(token, process.env.JWT_SECRET || "", (err, decode) => {
                if (err || decode == null) {
                    res.status(401).send({
                        message: "Invalid Token, Please Login Again",
                    });
                } else {
                    req.user = decode;
                    if (decode.isAdmin !== true) {
                        res.status(401).send({
                            message: "User Is Not Admin",
                        });
                        return;
                    }
                    next();
                }
            });
        } else {
            res.status(401).send({ message: "Token Not Supplied" });
        }
    } catch (err) {
        //console.log(err);
        res.status(500).send({ message: "Server Error" });
    }
}

app.prepare().then(() => {
    const server = express();
    server.use(
        "/images",
        express.static(path.join(__dirname, "../public/images"))
    );
    server.use(
        "/uploads",
        cookieParser(),
        isAdmin,
        express.static(path.join(__dirname, "../public/uploads"))
    );

    server.all("*", (req, res) => {
        return handle(req, res);
    });
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
        //console.log(process.env.JWT_SECRET);
    });
});
