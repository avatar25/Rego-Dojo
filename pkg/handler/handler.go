package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"testing/fstest"

	"github.com/open-policy-agent/opa/compile"
)

// CompileRequest defines the expected JSON body for compilation requests.
type CompileRequest struct {
	Rego string `json:"rego"`
}

// Handler receives Rego string, compiles to WASM, and returns it.
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CompileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Rego == "" {
		http.Error(w, "Rego code is required", http.StatusBadRequest)
		return
	}

	// 2. Compiling to WASM
	// We use an in-memory filesystem to provide the policy to the compiler.
	memFS := fstest.MapFS{
		"policy.rego": &fstest.MapFile{
			Data: []byte(req.Rego),
		},
	}

	compiler := compile.New().
		WithTarget("wasm").
		WithEntrypoints("play/allow").
		WithFS(memFS).
		WithPaths("policy.rego")

	if err := compiler.Build(context.Background()); err != nil {
		http.Error(w, "Compile error: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 3. Extracting the WASM binary
	bundle := compiler.Bundle()
	if len(bundle.WasmModules) == 0 {
		http.Error(w, "Failed to generate WASM module", http.StatusInternalServerError)
		return
	}

	wasmBytes := bundle.WasmModules[0].Raw

	// 4. Returning the binary
	w.Header().Set("Content-Type", "application/wasm")
	w.WriteHeader(http.StatusOK)
	w.Write(wasmBytes)
}
