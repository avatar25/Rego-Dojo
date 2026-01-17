import { useState } from "react";
import { levels } from "../../levels";
import { PolicyEditor } from "../editor/PolicyEditor";
import { InputViewer } from "../editor/InputViewer";
import { Console } from "../game/Console";
import { LevelSelect } from "../game/LevelSelect";
import { WinModal } from "../game/WinModal";
import { Play, Lightbulb } from "lucide-react";

export default function Dashboard() {
    const [currentLevelId, setCurrentLevelId] = useState(levels[0].id);
    const [code, setCode] = useState(levels[0].initialCode);
    const [logs, setLogs] = useState<{ type: 'info' | 'success' | 'error'; message: string; timestamp: string }[]>([]);
    const [showWinModal, setShowWinModal] = useState(false);
    const [completedLevels] = useState<string[]>([]); // Placeholder for store_

    const currentLevel = levels.find(l => l.id === currentLevelId) || levels[0];

    const handleLevelSelect = (id: string) => {
        const level = levels.find(l => l.id === id);
        if (level) {
            setCurrentLevelId(id);
            setCode(level.initialCode);
            setLogs([{
                type: 'info',
                message: `Loaded ${level.title}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        }
    };

    const handleNextLevel = () => {
        const currentIndex = levels.findIndex(l => l.id === currentLevelId);
        if (currentIndex < levels.length - 1) {
            handleLevelSelect(levels[currentIndex + 1].id);
            setShowWinModal(false);
        }
    };

    // Temporary dummy evaluation
    const handleEvaluate = () => {
        setLogs(prev => [...prev, {
            type: 'info',
            message: 'Evaluation logic pending implementation...',
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-72 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        REGO DOJO
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Master Policy as Code</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <LevelSelect
                        levels={levels}
                        currentLevelId={currentLevelId}
                        completedLevelIds={completedLevels}
                        onSelectLevel={handleLevelSelect}
                    />
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="text-xs text-slate-500 text-center">
                        v0.1.0 • OPA WASM
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm z-10">
                    <div>
                        <h1 className="text-lg font-semibold text-white">{currentLevel.title}</h1>
                        <p className="text-sm text-slate-400 truncate max-w-2xl">{currentLevel.description}</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Hints placeholder */}
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800 relative group">
                        <PolicyEditor
                            code={code}
                            onChange={(val) => setCode(val || "")}
                        />
                        {/* Floating Action Button for smaller screens or alternative layout could go here */}
                    </div>

                    {/* Right Panel */}
                    <div className="w-[400px] flex flex-col bg-slate-900/20 shrink-0">
                        <div className="flex-1 flex flex-col min-h-0">
                            <InputViewer data={currentLevel.inputData} />
                        </div>
                        <div className="h-1/3 flex flex-col border-t border-slate-800 min-h-[200px]">
                            <Console logs={logs} />
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <footer className="h-16 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between px-6 shrink-0 backdrop-blur-md">
                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800">
                        <Lightbulb size={16} />
                        <span>Need a hint?</span>
                    </button>

                    <button
                        onClick={handleEvaluate}
                        className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-900/20 active:translate-y-0.5"
                    >
                        <Play size={18} className="fill-current" />
                        Evaluate Policy
                        <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                    </button>
                </footer>

                <WinModal
                    isOpen={showWinModal}
                    levelTitle={currentLevel.title}
                    onNextLevel={handleNextLevel}
                    onClose={() => setShowWinModal(false)}
                    isLastLevel={levels.indexOf(currentLevel) === levels.length - 1}
                />
            </main>
        </div>
    )
}
