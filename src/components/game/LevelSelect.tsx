import type { Level, LevelCategory, LearningTrack } from "../../lib/types";
import { Award, BookOpen, CheckCircle, Circle, Lock, Route } from "lucide-react";
import { getLearningLesson } from "../../lib/learning";
import { getEarnedBadges, getTotalXp, isLevelUnlocked } from "../../lib/progress";

interface LevelSelectProps {
    levels: Level[];
    categories: LevelCategory[];
    currentLevelId: string;
    completedLevelIds: string[];
    bestStreak: number;
    tracks: LearningTrack[];
    onSelectLevel: (levelId: string, isChallengeUnlocked: boolean) => void;
}

export const LevelSelect = ({ levels, categories, currentLevelId, completedLevelIds, bestStreak, tracks, onSelectLevel }: LevelSelectProps) => {
    const totalXp = getTotalXp(completedLevelIds, levels);
    const badges = getEarnedBadges(completedLevelIds, bestStreak);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/60">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Progress</span>
                    <span className="text-sm font-semibold text-slate-900">{totalXp} pts - {completedLevelIds.length}/{levels.length}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            title={badge.description}
                            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs ${badge.earned
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                }`}
                        >
                            <Award size={13} />
                            <span className="truncate">{badge.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/60">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Route size={14} />
                    Real-world tracks
                </div>
                <div className="flex flex-col gap-2">
                    {tracks.map((track) => {
                        const completedTrackLevels = track.levelIds.filter((levelId) => completedLevelIds.includes(levelId)).length;
                        const isActiveTrack = track.levelIds.includes(currentLevelId);

                        return (
                            <div
                                key={track.id}
                                className={`rounded-md border px-3 py-2 ${isActiveTrack
                                    ? 'border-emerald-200 bg-emerald-50'
                                    : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-sm font-medium text-slate-800">{track.title}</span>
                                    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] ${track.status === 'active'
                                        ? 'border-emerald-200 bg-white text-emerald-800'
                                        : 'border-slate-200 bg-white text-slate-500'
                                        }`}>
                                        {track.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{track.description}</p>
                                {track.levelIds.length > 0 && (
                                    <div className="mt-2 text-[10px] text-slate-400">
                                        {completedTrackLevels}/{track.levelIds.length} linked lessons complete
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Concept map</h3>
            {categories.map((category) => (
                <div key={category.id} className="mb-3 last:mb-0">
                    <div className="mb-2 px-2">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                {category.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">
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
                            const lesson = getLearningLesson(level.id);

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => onSelectLevel(level.id, !isLocked || isCompleted)}
                                    className={`
              relative flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all
              ${isActive
                                            ? "bg-emerald-50 border border-emerald-300 text-slate-950 shadow-sm shadow-emerald-100"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"}
              ${isLocked && !isCompleted ? "hover:border-amber-200" : ""}
            `}
                                >
                                    <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border shrink-0
              ${isCompleted
                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                            : isActive
                                                ? "bg-white border-emerald-400 text-emerald-700"
                                                : "bg-slate-50 border-slate-200 text-slate-400"}
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
                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                                            <BookOpen size={11} />
                                            <span className="truncate">{lesson.conceptLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${level.difficulty === 'Beginner' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                                                level.difficulty === 'Intermediate' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                    'border-rose-200 bg-rose-50 text-rose-700'
                                                }`}>
                                                {level.difficulty}
                                            </span>
                                            {isLocked && !isCompleted ? (
                                                <span className="text-[10px] text-amber-700">read lesson</span>
                                            ) : (
                                                <span className="text-[10px] text-slate-400">{level.xp} pts</span>
                                            )}
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
