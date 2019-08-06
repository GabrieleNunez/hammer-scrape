/**
 * The type of mode that an engine can be in.
 * ONLY ONE MODE can be used at one time
 */
export enum EngineMode {
    Off = 'off',
    Loading = 'loading',
    Idling = 'idling',
    Parsing = 'parsing',
    Manipulating = 'manipulating',
}

export default EngineMode;
