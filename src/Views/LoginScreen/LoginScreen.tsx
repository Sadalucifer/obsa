import React from 'react'
import './LoginScreen.style.css'
import { DependencyInjector } from '../../DependencyInjector/DependencyInjector'
import { LoginViewModel, LoginState } from '../../ViewModels/LoginViewModel'
import { ComponentBase } from 'resub'
import { TextField, IconButton } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { ImageAssets } from '../../Assets/index'
import SnackbarComponent from '../../Components/SnackBarComponent'

export default class LoginScreen extends ComponentBase<any, LoginState> {
    viewModel: LoginViewModel

    constructor(props: any) {
        super(props)
        this.viewModel = DependencyInjector.default().provideLoginViewModel()
    }

    componentDidUpdate() {
        if (this.state.isLoggedIn) {
            const toLocation: any = '/tenant'
            this.props.history.push(toLocation)
        }
    }

    render() {

        return (
            <div className='main-holder'>
                <div className='main-card-holder'>
                    <div className='image-holder'><img src={ImageAssets.ic_logo} alt='logo' style={{ height: 40, width: 165, marginBottom: 20 }}></img></div>

                    <div className='login-holder'>
                        <div className='login-details-holder'>
                            {
                                this.state.error &&
                                <SnackbarComponent
                                    className={'snackbar-error'}
                                    message={this.state.error && this.state.error.message}
                                    vertical={'bottom'}
                                    horizontal={'center'}
                                    open={this.state.error ? true : false}
                                    onClose={() => {
                                        this.viewModel.set('error', undefined)
                                    }}
                                />
                            }


                            <TextField
                                className='textinput'
                                label='Email'
                                variant='outlined'
                                required={true}
                                onChange={(event) => this.viewModel.set('email', event.target.value)}
                                style={{ marginTop: 10 }}
                                onFocus={() => {
                                    this.viewModel.set('error', undefined)
                                    this.viewModel.set('emailValidateError', undefined)
                                }}
                            />
                            < div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                                <span style={{ color: 'red' }}>{this.state.emailValidateError && this.state.emailValidateError.message}</span>
                            </div>

                            <TextField
                                className='textinput'
                                label='Password'
                                variant='outlined'
                                required={true}
                                onChange={(event) => this.viewModel.set('password', event.target.value)}
                                type={this.state.passwordVisible ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => {
                                                this.viewModel.set('passwordVisible', !this.state.passwordVisible)
                                            }}
                                        >
                                            {this.state.passwordVisible ? < Visibility /> : <VisibilityOff></VisibilityOff>
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                onFocus={() => {
                                    this.viewModel.set('error', undefined)
                                    this.viewModel.set('passwordValidateError', undefined)
                                }}
                            />

                            <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                                <span style={{ color: 'red' }}>{this.state.passwordValidateError && this.state.passwordValidateError.message}</span>
                            </div>

                        </div>
                        <button
                            type='button'
                            className='login-button-holder'
                            onClick={() => {
                                this.viewModel.login()
                            }}
                        >
                            {!this.state.isLoading ? <span>Login</span> :
                                <img src={ImageAssets.ic_loader} alt='loader' style={{ height: 35, width: 40 }} />}

                        </button>

                    </div>
                </div>
            </div >

        )
    }

    _buildState() {
        return this.viewModel.getState()
    }
}
