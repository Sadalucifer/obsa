export class ValidationUtils {

    public isMobileNumberValid(ph: string) {
        return (ph.trim().length === 10) ? true : false
    }

    public isEmailValid(email: string) {
        const regX = new RegExp(/^[a-zA-Z0-9_]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/)
        return regX.test(email)
    }

    public isEmpty(str: string) {
        return (str.trim().length === 0) ? true : false
    }

    public isPasswordValid(password: string) {
        const regX = new RegExp(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?@."]).*$/)
        return regX.test(password)
    }

}
