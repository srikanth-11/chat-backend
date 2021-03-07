// importing
import * as mongoose from 'mongoose';
import { Validator } from '../../services/validator';

// creating instance of validator service
const validator = new Validator();
// Creating Schema For User
const userSchema = new mongoose.Schema({

    // store email to identify user when login
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value:string) => {
                return validator.isEmail(value);
            }
        }
    },

    // store username
    username: {
        type: String,
        required: true
    },

    // store user's password
    password: {
        type: String,
        required: true
    },

    // store account activation code
    accountActivationCode: String,

    // store expiry time for account activation code
    accountActivationCodeExpiry: {
        type: Date,
        default: Date.now()
    },

    // check if registered account is activated or not
    isActive: {
        type: Boolean,
        default: false
    },

    // store reset password token
    resetPasswordToken: String,

    // store reset password token expiry time
    resetPasswordTokenExpiry: Number
})

// Creating an interface for User
interface IUser extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    accountActivationCode: string;
    accountActivationCodeExpiry: number,
    isActive: boolean,
    resetPasswordToken: string,
    resetPasswordTokenExpiry: number
}

//Create a model/Collection for user Schema
const User = mongoose.model<IUser>('User', userSchema);

//exporting model
export { User, IUser };