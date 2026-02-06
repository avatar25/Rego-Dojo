package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHandler(t *testing.T) {
	// 1. Define a valid Rego policy input
	validRego := `package play
default allow = false
allow { input.user == "alice" }`

	reqBody, _ := json.Marshal(CompileRequest{Rego: validRego})
	req := httptest.NewRequest(http.MethodPost, "/api/compile", bytes.NewBuffer(reqBody))
	rr := httptest.NewRecorder()

	// 2. Call the handler
	Handler(rr, req)

	// 3. Verify status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// 4. Verify Content-Type
	if contentType := rr.Header().Get("Content-Type"); contentType != "application/wasm" {
		t.Errorf("handler returned wrong content type: got %v want %v",
			contentType, "application/wasm")
	}

	// 5. Verify that we got some binary data (basic check)
	if rr.Body.Len() == 0 {
		t.Errorf("handler returned empty body")
	}

	// 6. Test invalid input (empty Rego)
	reqBodyInvalid, _ := json.Marshal(CompileRequest{Rego: ""})
	reqInvalid := httptest.NewRequest(http.MethodPost, "/api/compile", bytes.NewBuffer(reqBodyInvalid))
	rrInvalid := httptest.NewRecorder()

	Handler(rrInvalid, reqInvalid)

	if status := rrInvalid.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code for invalid input: got %v want %v",
			status, http.StatusBadRequest)
	}
}

func TestHandler_ParseError(t *testing.T) {
	// 1. Define INVALID Rego code
	invalidRego := `package play
default allow = false
allow { input.user == ` // syntax error

	reqBody, _ := json.Marshal(CompileRequest{Rego: invalidRego})
	req := httptest.NewRequest(http.MethodPost, "/api/compile", bytes.NewBuffer(reqBody))
	rr := httptest.NewRecorder()

	Handler(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code for parse error: got %v want %v",
			status, http.StatusBadRequest)
	}

	body := rr.Body.String()
	if !strings.Contains(body, "Compile error") {
		t.Errorf("handler should return compile error message, got: %s", body)
	}
}

func TestHandler_MethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/compile", nil)
	rr := httptest.NewRecorder()

	Handler(rr, req)

	if status := rr.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code for invalid method: got %v want %v",
			status, http.StatusMethodNotAllowed)
	}
}

func TestHandler_InvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/compile", strings.NewReader("{"))
	rr := httptest.NewRecorder()

	Handler(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code for invalid json: got %v want %v",
			status, http.StatusBadRequest)
	}
}
