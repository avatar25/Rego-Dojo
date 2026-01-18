# 🏯 Rego Dojo

> **The Gamified Open Policy Agent Training Ground.**  
> *Master Policy-as-Code. Level up your security skills.*

![Rego Dojo Dashboard Mockup](https://raw.githubusercontent.com/open-policy-agent/opa/main/docs/media/opa-logo-transparent.png)

Rego Dojo is an interactive, browser-based game designed to teach **Open Policy Agent (OPA)** policy authoring. Unlike a standard playground, it offers a structured **campaign mode** where you solve security puzzles to unlock new levels.

![Status](https://img.shields.io/badge/Status-Beta-emerald)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Go%20%7C%20WASM-blue)
![License](https://img.shields.io/badge/License-MIT-slate)

---

## 🚀 Features

- **🎮 Interactive Campaign**: Progress through levels ranging from basic equality checks to complex K8s admission control logic.
- **⚡️ Client-Side Evaluation**: Policies are compiled to **WebAssembly (WASM)** and evaluated directly in your browser for instant feedback.
- **🛡️ Serverless Compiler**: A lightweight Go backend handles the heavy lifting of compiling Rego code to WASM.
- **💾 Auto-Save**: Your progress (completed levels) is persisted automatically so you can pick up where you left off.
- **💅 Modern UI**: Built with a sleek, dark-themed interface using **Tailwind CSS**, **Framer Motion**, and **Monaco Editor**.

---

## 🕹️ How to Play

1.  **Select a Level**: Start with "The Bouncer" (Level 1) to learn the basics.
2.  **Write Policy**: Use the editor on the left to write Rego code that satisfies the requirements.
    - *Goal*: Allow valid requests while denying invalid ones.
3.  **Inspect Input**: Analyze the JSON input on the right to understand the data structure.
4.  **Evaluate**: Click **evaluate** (or press `Cmd+Enter`) to run your policy against a suite of hidden test cases.
5.  **Level Up**: Passing all tests unlocks the next challenge!

---

## 🛠️ Tech Stack

### Frontend
-   **React 19**: The latest and greatest for UI logic.
-   **Vite**: Blazing fast build tool.
-   **Tailwind CSS v4**: Utility-first styling with a custom dark theme.
-   **Zustand**: Lightweight global state management for tracking game progress.
-   **Monaco Editor**: VS Code-like editing experience in the browser.

### Backend & Core
-   **Go 1.24**: Powers the API.
-   **OPA v1 SDK**: Used to compile Rego strings into executable WASM binaries.
-   **WebAssembly**: The compiled policies run entirely in the browser using `@open-policy-agent/opa-wasm`.

---

## 👩‍💻 Local Development

Clone the project and get started in minutes.

### Prerequisites
-   Node.js v18+
-   Go 1.24+ (for the compilation API)

### 1. Installation
```bash
git clone https://github.com/your-username/rego-dojo.git
cd rego-dojo
npm install
```

### 2. Run the App

You can run the app using **Vercel CLI** (easiest) or **Manually**.

**Option A: Vercel CLI**
This mimics the production environment perfectly.
```bash
vercel dev
```

**Option B: Manual Setup**
If you don't want to use Vercel locally, you can run the backend and frontend separately.

1.  **Start Backend (Go)**:
    Runs on `http://localhost:8080`.
    ```bash
    go run cmd/server/main.go
    ```

2.  **Start Frontend (React)**:
    Runs on `http://localhost:3000` (proxies `/api` to backend).
    ```bash
    npm run dev
    ```

### 3. Testing
Run the full test suite (Go backend tests + React component tests):
```bash
npm test       # Frontend tests (Vitest)
go test ./...  # Backend tests
```

---

## 📁 Project Structure

```plaintext
rego-dojo/
├── api/                  # 🟢 Vercel Serverless Functions (Go)
│   ├── compile.go        # Handlers for Rego -> WASM compilation
├── src/
│   ├── components/       # 🧩 React UI Components
│   │   ├── editor/       # Policy Code Editor & Input Viewer
│   │   ├── game/         # Game logic (Console, LevelSelect, WinModal)
│   │   └── layout/       # Main Dashboard Layout
│   ├── levels/           # 📚 Level Content (The "database" of levels)
│   ├── lib/              # ⚙️ Core Libraries
│   │   ├── opa.ts        # OPA Runtime Wrapper
│   │   └── types.ts      # TypeScript Definitions
│   ├── store/            # 📦 State Management (Zustand)
│   └── test/             # 🧪 Test Setup
```

---

## � Future Roadmap

-   [ ] **Custom Themes**: Let users choose their editor theme.
-   [ ] **Community Levels**: Allow users to share their own puzzle scenarios.
-   [ ] **Leaderboards**: Compete for the most efficient policies.
-   [ ] **More Levels**: Advanced scenarios for Terraform, Envoy, and raw JSON APIs.

---

License: MIT
