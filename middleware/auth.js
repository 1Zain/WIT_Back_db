const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({message: "No token provided"});

        try {
            const decode = jwt.verify(token , "fewhoufewuofebwo32b4ion32pndspjwe0rfhnw4io5n4oinfsdpibfwoib4o3b5gwgwrt3454324nb5jbsdj");
            req.user = decode;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({message: "Forbidden"});
            }

            next();
        }
        catch(err) {
            res.status(400).json({message: "Invalid token"});
        }
    };
};

module.exports = authMiddleware;