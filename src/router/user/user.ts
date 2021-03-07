// importing
import { Request, Response, Router } from 'express';
import { User, IUser } from '../../models/users/users';
import  * as bycrypt from 'bcrypt';
import { Validator } from '../../services/validator';
import jwt from 'jsonwebtoken';
import { MailService } from '../../services/mail';
import * as crypto from 'crypto';
import { authenticate } from '../../services/authentication';
import * as express from 'express'

// router config
const router:Router = express.Router()

// creating instance of validator service
const validator = new Validator();

// handle user login 
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {

        // find user exists and compare password to authenticate the user
        let user: IUser = await User.findOne({ email: req.body.email });
        let isUserAuthenticated: boolean = await bycrypt.compare(req.body.password, user.password);

        // if user authenticated create jwt token and sent to user.
        if (isUserAuthenticated && user.isActive) {
            let token: string = jwt.sign({ userid: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
            res.json({
                message: 'User logged In',
                token,
                status: 'Successfully logged in',
                user: {
                    email: user.email,
                    userId: user._id
                }
            })
        } else if (!user.isActive) {
            res.status(401).json({
                status: 'Failed to login',
                message: 'Account is not activated',
            })
        } else {
            res.status(401).json({
                status: 'Failed to login',
                message: 'Provided credentials are wrong please verify',
            })
        }
    } catch (err) {
        res.status(401).json({
            message: 'user not found'
        })
    }
})

// handle user register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        // find is user exists with the help of email and handle accordingly 
        let user: IUser = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({
                message: "Email already registered"
            });
        } else if (!validator.isEmail(req.body.email)) {
            res.status(400).json({
                message: 'Invalid  Email, please enter a valid email',
            })
        } else {
            // hash the password send by the user 
            let salt = await bycrypt.genSalt(10);
            let hashPassword = await bycrypt.hash(req.body.password, salt);

            // create a random string for activation code
            let activationCode = await crypto.randomBytes(32).toString('hex');

            // insert the user in the db
            const newUser: IUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashPassword,
                accountActivationCode: activationCode,
                accountActivationCodeExpiry: Date.now() + 3000000000000000,
            })
            const result = await newUser.save();

            // Set value to send for account activation
            const mailService = new MailService();
            const mailSubject = 'Account Activation for srichat-app';
            const mailBody = `<div>
                                <h4>
                                 To activate the account please 
                                     <a href="${process.env.REQUEST_ORIGIN}/activate-account/${activationCode}">click here</a>
                                </h4>
                             </div>`;

            const mailTo = req.body.email;

            // send mail for account activation
            mailService.sendMail(mailSubject, mailBody, mailTo);

            // send response message 
            res.json({
                message: `Mail has been sent to   ${mailTo}  for account activation`,
                data: result
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Unable to register user"
        })
    }
})


// verfiy account activation code and acivate the account and send jwt token
router.post('/activate-account/:activationCode', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.params.activationCode);
        // find user if activation code is valid 
        let user = await User.findOne({ $and: [{ accountActivationCode: req.params.activationCode }, { accountActivationCodeExpiry: { $gt: Date.now() } }] });

        console.log(user);
        // if activation code is valid generate the jwt token and send it to client
        if (user) {
            user.isActive = true;
            user.accountActivationCode = '';
            user.accountActivationCodeExpiry = Date.now();
            await user.save();

            // redirect to the ui for login with success message
            const token: string = jwt.sign({ userid: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
            res.json({
                message: 'Account activated successfully',
                token
            })
        } else {
            // redirect to the ui with error message
            res.json({
                message: 'Account activation failed, token expired'
            })
        }

    } catch (err) {
        console.log(err);
    }
})

router.get('/ping', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        // check if user exists and is active
        let user = await User.findOne({ _id: req.body.userid });
        if (user && user.isActive) {
            res.json({
                message: "user is logged in",
                data: {
                    email: req.body.email,
                    userid: req.body.userid
                }
            })
        } else {
            res.status(400).json({
                message: "User Does not exists",
            })
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        console.log(req.body.email);

        // check if user exists with given email
        let user: IUser = await User.findOne({ email: req.body.email });
        if (user) {

            // create a token for reset password with expixy and update in db
            let resetToken = await crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = Date.now() + 30000;
            await user.save();

            console.log('resetToken', resetToken);
            // Send mail for account activation
            const mailService = new MailService();
            const mailSubject = 'Reset Password for srichat-app';
            const mailBody = `<div>
                <h3>Reset Password</h3>
                <p>Please click the given link to reset your password <a target="_blank" href="${process.env.REQUEST_ORIGIN}/reset-password/${encodeURI(resetToken)}"> click here </a></p>
            </div>`;

            const mailTo = user.email;

            // send mail for account activation
            mailService.sendMail(mailSubject, mailBody, mailTo);

            //send response message for uesr
            res.json({
                message: `Mail has been sent to ${user.email}</h4> with further instructions`,
            })
        } else {
            res.status(400).json({
                message: 'User not found',
            })
        }

    } catch (err) {
        console.log(err);
    }
})


router.post('/reset-password', async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const token = req.body.token;
        let user = await User.findOne({ resetPasswordToken: decodeURI(token), resetPasswordTokenExpiry: { $gt: Date.now() } });
        if (user && password === confirmPassword) {
            // hash the password send by the user 
            let salt = await bycrypt.genSalt(10);
            let hashPassword = await bycrypt.hash(password, salt);

            // Updating user password
            user.password = hashPassword;
            user.resetPasswordToken = '';
            user.resetPasswordTokenExpiry = Date.now();
            await user.save();

            // Send message for suucessfull password reset
            const mailService = new MailService();
            const mailSubject = 'Successfully Reset Password for srichat-app';
            const mailBody = `<div>
                 <h3>Your password was reset successfully </h3>
             </div>`;

            const mailTo = user.email;

            // send mail for account activation
            mailService.sendMail(mailSubject, mailBody, mailTo);

            res.json({
                message: "Password reset successfull check your mail for confirmation",
                token,
                data: {
                    email: user.email
                }
            })
        } else {
            res.status(400).json({
                message: "Failed to update password token invalid",
            })
        }
    } catch (err) {
        console.log(err);
    }
})

export  default router;