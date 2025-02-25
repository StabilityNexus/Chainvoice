import type { ContractDefinition } from 'solidity-ast';
import { ASTDereferencer } from 'solidity-ast/utils';
import { SrcDecoder } from '../../src-decoder';
import { ValidationExceptionInitializer } from '../run';
/**
 * Reports if this contract is non-abstract and any of the following are true:
 * - 1. Missing initializer: This contract does not appear to have an initializer, but parent contracts require initialization.
 * - 2. Missing initializer call: This contract's initializer is missing a call to a parent initializer.
 * - 3. Duplicate initializer call: This contract has duplicate calls to the same parent initializer function.
 * - 4. Incorrect initializer order (warning): This contract does not call parent initializers in the correct order.
 */
export declare function getInitializerExceptions(contractDef: ContractDefinition, deref: ASTDereferencer, decodeSrc: SrcDecoder): Generator<ValidationExceptionInitializer>;
//# sourceMappingURL=initializer.d.ts.map