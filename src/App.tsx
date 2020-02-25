import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DependencyInjector } from './DependencyInjector/DependencyInjector'
import { UserRepository } from './Domain/Repository/UserRepository'
import { ComponentBase } from 'resub'
import PageNotFound from './Components/PageNotFound/page-not-found'
import { IBaseState } from './Domain/Repository/BaseRepository'
import PageLoader from './Components/Loader/PageLoader'
import LoginScreen from './Views/LoginScreen/LoginScreen'
import { Tenant } from './Views/Tenant/Tenant'
import Admin from './Views/Admin/Admin'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

export default class App extends ComponentBase<any, IBaseState> {
    userRepository: UserRepository

    constructor(props: any) {
        super(props)
        DependencyInjector.initilize(localStorage)
        this.userRepository = DependencyInjector.default().provideUserRepository()
    }

    async componentDidMount() {
        this.userRepository.autoAuthenticate()
        if (this.props.location && this.props.location.pathname) {
            this.props.history.replace(this.props.location.pathname, this.props.location.state)
        }
    }

    render() {
        if (this.state.isLoading) {
            return <PageLoader></PageLoader>
        }

        return (
            <Switch>
                <Route exact={true} path='/login' component={LoginScreen} />
                <ProtectedRoute isLoggedIn={this.state.isLoggedIn} path='/tenant' component={Tenant} />
                <ProtectedRoute isLoggedIn={this.state.isLoggedIn} path='/admin' component={Admin} />
                <Redirect from='/' exact to='/tenant' />
                <Route exact={true} path='*' render={(props: any) => <PageNotFound {...props} />} />
            </Switch>
        )
    }

    _buildState() {
        return this.userRepository.getState()
    }

}
