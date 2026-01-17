export default function Dashboard() {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4">
                <h2 className="text-xl font-bold text-emerald-400 mb-6">REGO DOJO</h2>
                <div className="space-y-2">
                    <p className="text-sm text-slate-400">Levels placeholder</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-6">
                    <h1 className="text-lg font-medium">Scenario title</h1>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane */}
                    <div className="flex-1 border-r border-slate-800">
                        <div className="p-4 text-slate-400">Editor placeholder</div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-96 flex flex-col">
                        <div className="flex-1 p-4 border-b border-slate-800 overflow-auto">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Input Data</h3>
                            <pre className="text-sm">{"{}"}</pre>
                        </div>
                        <div className="h-64 p-4 bg-slate-950 font-mono text-xs overflow-auto">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Console</h3>
                            <div className="text-emerald-500">{">"} Ready</div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <footer className="h-16 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
                    <div className="flex gap-4">
                        <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Hint</button>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-md font-semibold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                        Evaluate (⌘+↵)
                    </button>
                </footer>
            </main>
        </div>
    )
}
