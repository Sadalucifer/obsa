import { ApiManager } from '../Domain/Api/ApiManger'
import { ValidationUtils } from '../Core/ValidationUtils'
import { LoginViewModel } from '../ViewModels/LoginViewModel'
import { UserRepository } from '../Domain/Repository/UserRepository'
import { HomeViewModel } from '../ViewModels/HomeViewModel'
import { TenantViewmodel } from '../ViewModels/TenantViewModel'
import { AdminViewModel } from '../ViewModels/AdminViewModel'
import { DateUtils } from '../Core/DateUtils'
export class DependencyInjector {

    private static shared: DependencyInjector
    private apiManager: ApiManager
    private ValidationUtils: ValidationUtils
    private userRepository: UserRepository
    private dateUtils: DateUtils

    constructor(private preference: any) {
        this.apiManager = new ApiManager(preference)
        this.dateUtils = new DateUtils()
        this.ValidationUtils = new ValidationUtils()
        this.userRepository = new UserRepository(this.apiManager)

    }

    public static initilize(preference: any) {
        if (!this.shared) {
            this.shared = new DependencyInjector(preference)

        }
    }

    public static default() {
        return this.shared
    }

    public provideUserRepository() {
        return this.userRepository
    }

    public provideLoginViewModel() {
        return new LoginViewModel(this.userRepository, this.ValidationUtils)
    }

    public provideHomeViewModel() {
        return new HomeViewModel()
    }

    public provideTenantViewModel() {
        return new TenantViewmodel(this.userRepository, this.ValidationUtils, this.dateUtils)
    }

    public provideAdminViewModel() {
        return new AdminViewModel(this.userRepository, this.ValidationUtils)
    }

}
