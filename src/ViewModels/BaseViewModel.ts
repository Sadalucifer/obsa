import { AutoSubscribeStore, StoreBase } from 'resub'
import axios, { CancelTokenSource } from 'axios'

@AutoSubscribeStore
export class BaseViewModel extends StoreBase {

    cancelationSource: CancelTokenSource

    constructor() {
        super()
        const CancelTokenGenerator = axios.CancelToken
        this.cancelationSource = CancelTokenGenerator.source()
    }

}
