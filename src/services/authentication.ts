import { Request, Response, Next} from 'express';
import jwt from 'jsonwebtoken';

// authenticate the user is logged in or not
function authenticate(req: Request, res: Response, next:Next): void {
    if (req.headers.authorization) {

        jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET_KEY, function (err, data) {
            if (data) {
                console.log(data)
                if (data.userid) {
                    req.body.userid = data.userid
                    req.body.email = data.email
                    next()
                } else {
                    res.status(401).json({
                        message: "Not Authorized"
                    })
                }

            } else {
                res.status(400).json({
                    message: "Invalid Token"
                })
            }
        })
    } else {
        res.status(400).json({
            messsage: "No Token Present"
        })
    }
}

export { authenticate };