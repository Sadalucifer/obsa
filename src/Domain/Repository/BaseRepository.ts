import { ApiManager } from '../Api/ApiManger'
import { StoreBase, autoSubscribe } from 'resub'

export interface IBaseState {
    loggedInUser?: any,
    loggedInToken?: any,
    isLoggedIn: boolean
    isLoading: boolean,
    error?: Error
}

export class BaseRepository extends StoreBase {
    protected apiManager: ApiManager
    protected state: IBaseState
    constructor(apiManager: ApiManager) {
        super()
        this.apiManager = apiManager
        this.state = this.defaultState()
    }

    public defaultState() {
        return {
            loggedInUser: undefined,
            loggedInToken: undefined,
            isLoggedIn: false,
            isLoading: false,
            error: undefined
        }
    }

    protected setState(newState: any) {
        this.state = { ...newState }
        this.trigger()
    }

    @autoSubscribe
    public getState() {
        return this.state
    }

    public set(key: string, value: any) {
        const newState: any = { ...this.state }
        newState[key] = value
        this.setState(newState)
    }

}