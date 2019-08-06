import EngineMode from 'engine_mode';

/**
 * A generimc core error
 */
export abstract class EngineError extends Error {
    public constructor(message?: string) {
        super(message ? message : 'An unknown core error has occurred');
    }
}

export class EngineModeError extends EngineError {
    public constructor(error: string) {
        super(error);
    }
}

export class EngineCannotSwitchModeError extends EngineModeError {
    public constructor() {
        super('Engine is not idling.Cannot switch modes');
    }
}
