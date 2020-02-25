import { BaseViewModel } from './BaseViewModel'
import { autoSubscribe } from 'resub'
import { UserRepository } from '../Domain/Repository/UserRepository'
import { ValidationUtils } from '../Core/ValidationUtils'
import { DateUtils } from '../Core/DateUtils'

export interface ITenantState {
    error?: Error,
    response: any,
    isLoading: boolean,
    tenants: any[],
    filterData: string,
    pageSize: number,
    pageIndex: number,
    openInviteTenantForm: boolean,
    tenantOrganizationNameError?: Error,
    tenantEmailError?: Error,
    tenantAccountOwnerNameError?: Error,
    tenantPhoneNumber: string,
    tenantPhoneNumberError?: Error,
    tenantOrganizationName: string,
    tenantEmail: string,
    tenantAccountOwnerName: string,
    searchData: string,
    totalCount: number
}

export class TenantViewmodel extends BaseViewModel {

    private state: ITenantState

    constructor(private userRepository: UserRepository, private validationUtils: ValidationUtils, private dateUtil: DateUtils) {
        super()
        this.state = this.defaultState()
    }

    defaultState() {
        return {
            error: undefined,
            response: undefined,
            isLoading: false,
            tenants: [],
            filterData: '',
            pageSize: 10,
            pageIndex: 0,
            openInviteTenantForm: false,
            tenantOrganizationNameError: undefined,
            tenantEmailError: undefined,
            tenantAccountOwnerNameError: undefined,
            tenantOrganizationName: '',
            tenantPhoneNumber: '',
            tenantPhoneNumberError: undefined,
            tenantEmail: '',
            tenantAccountOwnerName: '',
            searchData: '',
            totalCount: 0
        }
    }

    setState(newState: ITenantState) {
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
            const response = await this.userRepository.getAllTenants(data)
            let tenants = []
            if (response && response.listTenants && response.listTenants.data && response.listTenants.data.length > 0) {
                tenants = response.listTenants.data.map((tenant: any) => {
                    return {
                        name: tenant.accountOwnerName,
                        email: tenant.email,
                        phoneNumber: tenant.phoneNumber,
                        organizationName: tenant.organizationName,
                        noOfProductManager: tenant.productManagers.length,
                        noOfTests: tenant.testCount,
                        createdDate: this.dateUtil.format(tenant.createdAt, 'Do MMM YYYY')
                    }
                })
            }

            this.setState({
                ...this.state,
                isLoading: false,
                tenants,
                totalCount: response.listTenants.totalCount
            })

        } catch (error) {
            this.setState({
                ...this.state,
                error,
                isLoading: false
            })
        }

    }

    getTableColumnList() {
        const list = [
            { name: 'Name', id: 'name' },
            { name: 'Email', id: 'email' },
            { name: 'Phone Number', id: 'phoneNumber' },
            { name: 'Organization Name', id: 'organizationName' },
            { name: '#No Of Product Managers', id: 'noOfProductManager' },
            { name: '#No Of Test', id: 'noOfTests' },
            { name: 'Created Date', id: 'createdDate' }
        ]
        return list
    }

    validate() {
        if (this.validationUtils.isEmpty(this.state.tenantOrganizationName)) {
            this.setState({
                ...this.state,
                tenantOrganizationNameError: Error('Please enter name ')
            })
        } else if (this.validationUtils.isEmpty(this.state.tenantEmail)) {
            this.setState({
                ...this.state,
                tenantEmailError: Error('Please enter email ')
            })
        } else if (!this.validationUtils.isEmailValid(this.state.tenantEmail)) {
            this.setState({
                ...this.state,
                tenantEmailError: Error('Invalid email format')
            })
        } else if (this.validationUtils.isEmpty(this.state.tenantAccountOwnerName)) {
            this.setState({
                ...this.state,
                tenantAccountOwnerNameError: Error('Please enter account owner name')
            })
        } else if (!this.validationUtils.isMobileNumberValid(this.state.tenantPhoneNumber)) {
            this.setState({
                ...this.state,
                tenantPhoneNumberError: Error('Please enter phone number')
            })
        }
    }

    async inviteTenant() {
        try {
            this.validate()
            if (this.state.tenantOrganizationNameError || this.state.tenantAccountOwnerNameError || this.state.tenantEmailError || this.state.tenantPhoneNumberError) {
                return
            }
            this.setState({
                ...this.state,
                isLoading: true,
                openInviteTenantForm: false
            })

            const data = {
                organizationName: this.state.tenantOrganizationName,
                email: this.state.tenantEmail,
                accountOwnerName: this.state.tenantAccountOwnerName,
                phoneNumber: this.state.tenantPhoneNumber
            }

            const response = await this.userRepository.inviteTenant(data)

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

}
