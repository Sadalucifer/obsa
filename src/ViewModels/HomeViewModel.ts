
import { BaseViewModel } from './BaseViewModel'
import { autoSubscribe } from 'resub'

export interface HomeState {
    error?: Error
    isSideOpened: boolean,
    anchorUi: any,
    isOpenMenu: boolean

}

export class HomeViewModel extends BaseViewModel {
    state: HomeState
    constructor() {
        super()
        this.state = this.defaultState()
    }

    defaultState() {
        return {
            error: undefined,
            isSideOpened: false,
            anchorUi: null,
            isOpenMenu: false
        }
    }

    setState(newState: any) {
        this.state = { ...newState }
        this.trigger()
    }

    @autoSubscribe
    getState() {
        return this.state
    }

    set(key: string, value: any) {
        const newState: any = { ...this.state }
        newState[key] = value
        this.setState(newState)
    }

    async logout() {
        await localStorage.clear()
        window.location.reload()
    }

}
