export class OnboardifyError extends Error {
    constructor(message: string, public code: Number) {
        super(message)
    }
}
