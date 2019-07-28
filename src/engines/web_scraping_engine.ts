import EngineModes from './engine_mode';
import EngineType from './engine_type';
import EngineCoreType from './engine_core_type';

export interface WebScrapingEngine {
    getEngineMode(): EngineModes;
    getEngineType(): EngineType;
    getEngineCoreType(): EngineCoreType;
}
