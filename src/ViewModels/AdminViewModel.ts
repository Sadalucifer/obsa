import { BaseViewModel } from './BaseViewModel'
import { autoSubscribe } from 'resub'
import { UserRepository } from '../Domain/Repository/UserRepository'
import { ValidationUtils } from '../Core/ValidationUtils'

export interface IAdminState {
    error?: Error,
    response: any,
    isLoading: boolean,
    filterData: string,
    admins: any[],
    pageSize: number,
    pageIndex: number,
    openAdminInviteForm: boolean,
    adminName: string,
    adminNameError?: Error,
    adminEmail: string,
    adminEmailError?: Error,
    adminPhoneNumber: string,
    adminPhoneNumberError?: Error,
    searchData: string,
    totalCount: number
}

export class AdminViewModel extends BaseViewModel {
    private state: IAdminState
    constructor(private userRepository: UserRepository, private validationUtils: ValidationUtils) {
        super()
        this.state = this.defaultState()
    }

    defaultState() {
        return {
            error: undefined,
            response: undefined,
            isLoading: false,
            filterData: '',
            admins: [],
            pageSize: 10,
            pageIndex: 0,
            openAdminInviteForm: false,
            adminName: '',
            adminNameError: undefined,
            adminEmail: '',
            adminEmailError: undefined,
            adminPhoneNumber: '',
            adminPhoneNumberError: undefined,
            searchData: '',
            totalCount: 0
        }
    }

    setState(newState: IAdminState) {
        this.state = newState
        this.trigger()
    }

    @autoSubscribe
    getState() {
        return this.state
    }

    set(key: string, value: any) {
        const currentState: any = { ...this.state }
        currentState[key] = value
        this.setState(currentState)
    }

    getTableColumnList() {
        const list = [
            { name: 'Name', id: 'name' },
            { name: 'Email', id: 'email' },
            { name: 'Phone Number', id: 'phoneNumber' },
            { name: 'Action', id: 'action' },
            { name: 'Status', id: 'status' },
        ]
        return list
    }

    validate() {

        if (this.validationUtils.isEmpty(this.state.adminName)) {
            this.setState({
                ...this.state,
                adminNameError: Error('Please enter name ')
            })
        } else if (this.validationUtils.isEmpty(this.state.adminEmail)) {
            this.setState({
                ...this.state,
                adminEmailError: Error('Please enter email ')
            })
        } else if (!this.validationUtils.isEmailValid(this.state.adminEmail)) {
            this.setState({
                ...this.state,
                adminEmailError: Error('Invalid email format')
            })
        } else if (!this.validationUtils.isMobileNumberValid(this.state.adminPhoneNumber)) {
            this.setState({
                ...this.state,
                adminPhoneNumberError: Error('Please enter the phone number')
            })
        }
    }

    async inviteAdmin() {
        try {
            this.validate()
            if (this.state.adminNameError || this.state.adminEmailError || this.state.adminPhoneNumberError) {
                return
            }

            this.setState({
                ...this.state,
                isLoading: true,
                openAdminInviteForm: false
            })
            const data = {
                name: this.state.adminName,
                email: this.state.adminEmail,
                phoneNumber: this.state.adminPhoneNumber
            }

            const response = await this.userRepository.invitetAdmin(data)

            this.setState({
                ...this.state,
                isLoading: false,
                response
            })

        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error
            })
        }
    }

    async load() {
        try {
            this.setState({
                ...this.state,
                isLoading: true,
                pageIndex: this.state.searchData ? 0 : this.state.pageIndex
            })

            const data = {
                pageIndex: this.state.pageIndex,
                pageSize: this.state.pageSize,
                searchData: this.state.searchData
            }

            let admins = []
            const response = await this.userRepository.getAllAdmins(data)
            if (response && response.admins && response.admins.data && response.admins.data.length > 0) {
                admins = response.admins.data.map((admin: any) => {

                    return {
                        name: admin.name,
                        email: admin.email,
                        phoneNumber: admin.phoneNumber,
                        action: admin.administration.status === 1 ? 'Block' : admin.administration.status === 0 ? 'ReInvite' : 'Unblock',
                        status: admin.administration.status === 1 ? 'Active' : admin.administration.status === 0 ? 'Invite' : 'Block',
                    }
                })
            }

            this.setState({
                ...this.state,
                isLoading: false,
                admins,
                totalCount: response.admins.totalCount
            })

        } catch (error) {
            this.setState({
                ...this.state,
                error,
                isLoading: false
            })
        }

    }

}
