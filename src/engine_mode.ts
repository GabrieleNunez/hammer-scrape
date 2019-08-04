/**
 * The type of mode that an engine can be in.
 * ONLY ONE MODE can be used at one time
 */
export enum EngineMode {
    Off = 0,
    Loading = 1,
    Idling = 2,
    Parsing = 3,
    Manipulating = 4,
}

export default EngineMode;
