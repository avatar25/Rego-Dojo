import { loadPolicy, type LoadedPolicy } from '@open-policy-agent/opa-wasm';

export interface EvaluationResult {
    result: boolean;
    decision_id?: string;
}

export class OPARuntime {
    private policy: LoadedPolicy | null = null;

    /**
     * Loads a WASM binary / response into the OPA runtime.
     */
    async load(wasm: ArrayBuffer | Response): Promise<void> {
        try {
            this.policy = await loadPolicy(wasm);
        } catch (error) {
            console.error('Failed to load OPA policy:', error);
            throw new Error(`Failed to load Wasm: ${error}`);
        }
    }

    /**
     * Evaluates the policy against the provided input.
     * Assumes the entrypoint is "play/allow" (boolean result).
     * 
     * @param input The JSON input data (object)
     */
    evaluate(input: object, entrypoint: string = 'play/allow'): boolean {
        if (!this.policy) {
            throw new Error('Policy not loaded');
        }

        // Evaluate the specific entrypoint.
        // The result from OPA WASM for a boolean rule corresponds to the result set.
        // Typically for "allow", if it's true, result is [{ result: true }].
        // If undefined/false, it might be empty or [{ result: false }].

        // However, opa-wasm 'evaluate' returns the raw result set.
        // For a simple rule `allow { ... }`:
        // - true: [ { result: true } ]
        // - false (or undefined): []

        // We try/catch just in case the policy traps.
        try {
            const resultSet = this.policy.evaluate(input, entrypoint);

            if (!resultSet || resultSet.length === 0) {
                return false;
            }

            // Check if the first result is true
            return resultSet[0].result === true;
        } catch (error) {
            console.error('Evaluation error:', error);
            return false;
        }
    }

    /**
     * Evaluates raw entrypoints if needed (debugging).
     */
    evaluateRaw(input: object, entrypoint?: string): any {
        if (!this.policy) return null;
        return this.policy.evaluate(input, entrypoint);
    }
}
