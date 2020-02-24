import { BaseViewModel } from './BaseViewModel'
import { autoSubscribe } from 'resub'
import { ValidationUtils } from '../Core/ValidationUtils'
import { UserRepository } from '../Domain/Repository/UserRepository'

export interface LoginState {
    email: string,
    password: string,
    error?: Error,
    forgotPassword: boolean,
    passwordVisible: boolean,
    isLoggedIn: boolean,
    emailValidateError?: Error,
    passwordValidateError?: Error,
    isLoading: boolean,
    response: any,
    forgotPasswordResponse: any,
    errorResponseMsg?: Error
}
export class LoginViewModel extends BaseViewModel {

    protected state: LoginState

    constructor(private userRepository: UserRepository, private validationUtils: ValidationUtils) {
        super()
        this.state = this.defaultState()
    }

    protected defaultState() {
        return {
            email: '',
            password: '',
            error: undefined,
            forgotPassword: false,
            passwordVisible: false,
            isLoggedIn: false,
            emailValidateError: undefined,
            passwordValidateError: undefined,
            isLoading: false,
            response: undefined,
            forgotPasswordResponse: undefined,
            errorResponseMsg: undefined
        }
    }

    @autoSubscribe
    public getState() {
        return this.state
    }

    public setState(newState: any) {

        this.state = { ...newState }
        this.trigger()
    }

    public set = (key: string, value: any) => {
        const newState: any = { ...this.state }
        newState[key] = value
        this.setState(newState)
    }

    public async login() {
        this.validate()
        if (this.state.emailValidateError || this.state.passwordValidateError) {
            return
        }
        this.setState({
            ...this.state,
            isLoading: true
        })
        try {
            const data = {
                email: this.state.email,
                password: this.state.password
            }
            const response = await this.userRepository.userAuthenticate(data)
            this.setState({
                ...this.state,
                isLoading: false,
                isLoggedIn: true

            })
        } catch (error) {
            this.setState({
                ...this.state,
                error,
                isLoading: false
            })
        }
    }

    private validate() {
        if (this.validationUtils.isEmpty(this.state.email)) {
            this.setState({
                ...this.state,
                emailValidateError: Error('Please enter email')
            })
        } else if (!this.validationUtils.isEmailValid(this.state.email)) {
            this.setState({
                ...this.state,
                emailValidateError: Error('Invalid email format')
            })
        } else if (this.validationUtils.isEmpty(this.state.password)) {
            this.setState({
                ...this.state,
                passwordValidateError: Error('Please enter password')
            })
        }
    }

}
