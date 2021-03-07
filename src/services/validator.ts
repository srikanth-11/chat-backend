import validator from 'validator';

class Validator {

    public isEmail(email: string): boolean {
        return validator.isEmail(email);
    }
}

export { Validator };