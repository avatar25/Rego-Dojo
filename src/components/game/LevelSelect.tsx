import type { Level, LevelCategory } from "../../lib/types";
import { CheckCircle, Circle, Lock, Trophy } from "lucide-react";
import { getEarnedBadges, getTotalXp, isLevelUnlocked } from "../../lib/progress";

interface LevelSelectProps {
    levels: Level[];
    categories: LevelCategory[];
    currentLevelId: string;
    completedLevelIds: string[];
    bestStreak: number;
    onSelectLevel: (levelId: string) => void;
}

export const LevelSelect = ({ levels, categories, currentLevelId, completedLevelIds, bestStreak, onSelectLevel }: LevelSelectProps) => {
    const totalXp = getTotalXp(completedLevelIds, levels);
    const badges = getEarnedBadges(completedLevelIds, bestStreak);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dojo rank</span>
                    <span className="text-sm font-semibold text-emerald-300">{totalXp} XP - {completedLevelIds.length}/{levels.length}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            title={badge.description}
                            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs ${badge.earned
                                ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                                : 'border-slate-800 bg-slate-900/40 text-slate-500'
                                }`}
                        >
                            <Trophy size={13} />
                            <span className="truncate">{badge.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Campaign map</h3>
            {categories.map((category) => (
                <div key={category.id} className="mb-3 last:mb-0">
                    <div className="mb-2 px-2">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                {category.title}
                            </h4>
                            <span className="text-[10px] text-slate-600">
                                {category.levels.filter((level) => completedLevelIds.includes(level.id)).length}/{category.levels.length}
                            </span>
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-500">{category.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {category.levels.map((level) => {
                            const isCompleted = completedLevelIds.includes(level.id);
                            const isActive = level.id === currentLevelId;
                            const isLocked = !isLevelUnlocked(level.id, completedLevelIds, levels);

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
                                        {isCompleted
                                            ? <CheckCircle size={16} />
                                            : isLocked
                                                ? <Lock size={14} />
                                                : <Circle size={14} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{level.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${level.difficulty === 'Beginner' ? 'border-blue-900/50 bg-blue-900/20 text-blue-400' :
                                                level.difficulty === 'Intermediate' ? 'border-orange-900/50 bg-orange-900/20 text-orange-400' :
                                                    'border-red-900/50 bg-red-900/20 text-red-400'
                                                }`}>
                                                {level.difficulty}
                                            </span>
                                            <span className="text-[10px] text-slate-500">{level.xp} XP</span>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-lg" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
