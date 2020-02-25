import { AutoSubscribeStore } from 'resub'
import { Constants } from '../../Resource/Constants'
import { BaseRepository } from './BaseRepository'

@AutoSubscribeStore
export class UserRepository extends BaseRepository {

    public async userAuthenticate(data: any) {
        try {
            const response = await this.apiManager.userAuthenticate(data)

            if (response && response.message === 'Success' && response.user) {
                await localStorage.setItem(Constants.LOGGED_IN_TOKEN, response.user.loginToken)
                this.setState({
                    ...this.state,
                    loggedInToken: response.user.loginToken,
                    loggedInUser: response.user,
                    isLoggedIn: true
                })
                return { isLoggedIn: true }
            } else {
                if (response.message) {
                    throw new Error(response.message)

                }
                throw new Error('cann\'t able to login try again')
            }

        } catch (error) {
            throw error
        }
    }

    public async checkToken() {
        const loginToken = await localStorage.getItem(Constants.LOGGED_IN_TOKEN)
        if (loginToken) {
            return true
        } else {
            return false
        }
    }

    async autoAuthenticate() {
        try {
            this.setState({
                ...this.state,
                isLoading: true
            })
            const loginToken = await localStorage.getItem(Constants.LOGGED_IN_TOKEN)
            if (loginToken) {
                const response = await this.apiManager.autoAuthenticate()
                this.setState({
                    ...this.state,
                    loggedInUser: response.data,
                    isLoggedIn: true
                })
            }
            this.setState({
                ...this.state,
                isLoading: false
            })
        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error
            })
        }
    }

    async getAllTenants(data: any) {
        try {
            const response = await this.apiManager.getAllTenants(data)
            return response
        } catch (error) {
            throw error

        }
    }

    async getAllAdmins(data: any) {
        try {
            const response = await this.apiManager.getAllAdmins(data)
            return response
        } catch (error) {
            throw error
        }
    }

    async inviteTenant(data: any) {
        try {
            const response = await this.apiManager.inviteTenant(data)
            return response
        } catch (error) {
            throw error
        }
    }

    async invitetAdmin(data: any) {
        try {
            const response = await this.apiManager.inviteAdmin(data)
            return response
        } catch (error) {
            throw error
        }
    }

}
