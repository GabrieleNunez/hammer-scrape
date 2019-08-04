/**
 * A generimc core error
 */
export abstract class CoreError extends Error {
    public constructor(message?: string) {
        super(message ? message : 'An unknown core error has occurred');
    }
}

/**
 * A standard Not initialized error meant to be thrown
 */
export class CoreNotInitializedError extends CoreError {
    public constructor() {
        super('Core is not initialized. Please call core.initialize() first');
    }
}
