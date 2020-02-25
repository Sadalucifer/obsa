import axios, { AxiosResponse } from 'axios'
import { Constants } from '../../Resource/Constants'
import { OnboardifyError } from './OnboardifyError'

export class ApiManager {

    constructor(preference: any) {
        axios.defaults.baseURL = 'http://192.168.0.122:1993/api'
    }

    private async defaultHeaders() {

        const headers: any = {

        }
        const loginToken = localStorage.getItem(Constants.LOGGED_IN_TOKEN)
        if (loginToken !== undefined) {
            headers.token = loginToken
        }
        headers['Content-Type'] = 'application/json'
        return headers
    }

    private processError(error: any) {
        if (axios.isCancel(error)) {
            return new OnboardifyError('Cancelled', 499)
        } else {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                const message = error.response.data.message
                const code = error.response.data.code
                return new OnboardifyError(message, code)
            } else {
                if (error.response) {
                    return new OnboardifyError(error.message, error.response.status)
                } else if (error.data && error.data.message) {
                    return new OnboardifyError(error.data.message, error.data.code)
                } else {
                    return new OnboardifyError(error.message, 400)
                }
            }
        }
    }
    public async userAuthenticate(data: any) {
        const headers = await this.defaultHeaders()
        try {
            const response: any = await axios.post('/admin/authenticate', data, {
                headers
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async autoAuthenticate() {
        try {
            const headers = await this.defaultHeaders()
            const response = await axios.post(`/admin/auto-authenticate`, null, {
                headers
            })
            return response.data
        } catch (error) {
            console.log('auto---error---', error)

            const processError = this.processError(error)
            if (processError) {
                throw processError
            }
        }
    }

    async getAllTenants(data: any) {
        try {
            const headers = await this.defaultHeaders()
            const response: AxiosResponse = await axios.get(`tenants?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&searchKey=${data.searchData}`, {
                headers
            })
            console.log('in Tenant', response)
            return response.data
        } catch (error) {
            const processorError = this.processError(error)
            if (processorError) {
                throw processorError
            }

        }
    }

    async getAllAdmins(data: any) {
        try {
            const headers = await this.defaultHeaders()
            const response: AxiosResponse = await axios.get(`admins?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&searchKey=${data.searchData}`, {
                headers
            })
            return response.data
        } catch (error) {
            const processorError = this.processError(error)
            if (processorError) {
                throw processorError
            }

        }
    }

    async inviteTenant(data: any) {
        try {
            const headers = await this.defaultHeaders()
            const response = await axios.post('/invite-tenant', data, {
                headers
            })
            return response.data
        } catch (error) {

            const processorError = this.processError(error)
            if (processorError) {
                throw processorError
            }
        }
    }

    async inviteAdmin(data: any) {
        try {
            const headers = await this.defaultHeaders()
            console.log('in Admin Before', data)
            const response = await axios.post('/invite-admin', data, {
                headers
            })
            console.log('---invite Admin---', response.data)
            return response.data
        } catch (error) {
            const processorError = this.processError(error)
            if (processorError) {
                throw processorError
            }
        }
    }

}
