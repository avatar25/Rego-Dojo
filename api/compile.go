package handler

import (
	"net/http"
)

// Handler receives Rego string, compiles to WASM, and returns it.
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Placeholder for OPA compilation logic
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("WASM binary placeholder"))
}
