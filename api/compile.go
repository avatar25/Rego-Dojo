package handler

import (
	"net/http"
	"rego-dojo/pkg/handler"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	handler.Handler(w, r)
}
