import type { Level } from "../../lib/types";
import { Lock, CheckCircle } from "lucide-react";

interface LevelSelectProps {
    levels: Level[];
    currentLevelId: string;
    completedLevelIds: string[];
    onSelectLevel: (levelId: string) => void;
}

export const LevelSelect = ({ levels, currentLevelId, completedLevelIds, onSelectLevel }: LevelSelectProps) => {
    return (
        <div className="flex flex-col gap-2 p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Campaign</h3>
            {levels.map((level, index) => {
                const isCompleted = completedLevelIds.includes(level.id);
                const isActive = level.id === currentLevelId;
                const isLocked = index > 0 && !completedLevelIds.includes(levels[index - 1].id);

                return (
                    <button
                        key={level.id}
                        disabled={isLocked && !isCompleted}
                        onClick={() => onSelectLevel(level.id)}
                        className={`
              relative flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all
              ${isActive
                                ? "bg-emerald-900/30 border border-emerald-500/50 text-emerald-100"
                                : "bg-slate-900/40 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700"}
              ${isLocked && !isCompleted ? "opacity-50 cursor-not-allowed grayscale" : ""}
            `}
                    >
                        <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border shrink-0
              ${isCompleted
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : isActive
                                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                    : "bg-slate-950 border-slate-800 text-slate-600"}
            `}>
                            {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{level.title}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${level.difficulty === 'Beginner' ? 'border-blue-900/50 bg-blue-900/20 text-blue-400' :
                                    level.difficulty === 'Intermediate' ? 'border-orange-900/50 bg-orange-900/20 text-orange-400' :
                                        'border-red-900/50 bg-red-900/20 text-red-400'
                                    }`}>
                                    {level.difficulty}
                                </span>
                            </div>
                        </div>

                        {isActive && (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-lg" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
