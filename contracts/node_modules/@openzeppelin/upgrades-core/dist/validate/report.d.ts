import { ValidationError } from './run';
export declare class UpgradeableContractErrorReport {
    readonly errors: ValidationError[];
    constructor(errors: ValidationError[]);
    get ok(): boolean;
    explain(color?: boolean): string;
}
export declare function describeError(e: ValidationError, color?: boolean): string;
//# sourceMappingURL=report.d.ts.map