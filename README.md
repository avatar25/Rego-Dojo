# 🏯 Rego Dojo

**The Gamified OPA Training Ground.**

Rego Dojo is a browser-based educational game designed to teach developers how to write **Open Policy Agent (OPA)** policies through interactive, puzzle-solving challenges. Unlike traditional playgrounds, Rego Dojo offers a structured "campaign" where you must fix broken policies to unlock higher levels.

![Vibe: Cyber-punk interface, fast feedback, highly visual. "Duolingo meets HackTheBox."](https://img.shields.io/badge/Vibe-Cyber--punk-emerald)
![Tech Stack: React 19, Vite, OPA WASM, Go](https://img.shields.io/badge/Tech-React19%20%7C%20Vite%20%7C%20OPA--WASM-blue)

---

## 🚀 The Core Concept

Rego Dojo leverages a modern, serverless architecture to provide a seamless learning experience:

1.  **Select a Level**: Choose from a variety of scenarios (e.g., "Level 1: The Bouncer").
2.  **Analyze & Code**: Examine the provided JSON `Input` and identify issues in the "Broken" `Rego Policy` using the embedded **Monaco Editor**.
3.  **Compile & Evaluate**: Your code is compiled to **WebAssembly (WASM)** via a Go-based Vercel Function and evaluated directly in your browser.
4.  **Level Up**: Match the "Win Conditions" to unlock the next challenge and earn achievements.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite) + TypeScript
- **Styling**: Tailwind CSS v4 (Dark mode, Slate/Emerald/Rose palette)
- **Editor**: `@monaco-editor/react` (VS Code experience)
- **Policy Engine**: `@open-policy-agent/opa-wasm`
- **Backend (Compiler)**: Go (running on Vercel Serverless Functions)
- **State Management**: `zustand`
- **Visuals**: `framer-motion` & `canvas-confetti`

---

## 📁 Directory Structure

```plaintext
rego-dojo/
├── api/                        # Vercel Serverless Functions (Go)
│   └── compile.go              # Rego string -> WASM binary compiler
├── src/
│   ├── components/
│   │   ├── editor/             # PolicyEditor & InputViewer
│   │   ├── game/               # LevelSelect, WinModal, Console
│   │   └── layout/             # Core Dashboard layout
│   ├── levels/                 # THE CONTENT CORE (Level Definitions)
│   ├── lib/                    # OPA wrappers and shared Types
│   ├── store/                  # Zustand progress tracking
│   ├── App.tsx                 # Main entry component
│   └── main.tsx                # React mount point
├── go.mod                      # API dependencies
├── package.json                # Frontend dependencies
└── vercel.json                 # Vercel deployment config
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18+
- **Go**: v1.24+ (for API development)

### Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/rego-dojo.git
    cd rego-dojo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Backend (Local)**:
    For local API development, use the [Vercel CLI](https://vercel.com/docs/cli):
    ```bash
    vercel dev
    ```

---

## 🎯 Project Roadmap

- [x] Initial Scaffolding & Directory Structure
- [x] Tailwind CSS v4 Integration
- [ ] OPA-WASM Compilation Pipeline
- [ ] Core Game Loop (Evaluate -> Win/Loss)
- [ ] Tutorial Levels (Basics, RBAC, K8s)
- [ ] Achievement & Persistence System (LocalStorage)

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the OPA Community.
