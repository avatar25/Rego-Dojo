import { useEffect, useState } from "react";
import { levelCategories, levels } from "../../levels";
import { PolicyEditor } from "../editor/PolicyEditor";
import { InputViewer } from "../editor/InputViewer";
import { Console } from "../game/Console";
import { LevelSelect } from "../game/LevelSelect";
import { WinModal } from "../game/WinModal";
import { BookOpen, ClipboardCheck, Code2, FileJson, Library, Lightbulb, ListChecks, Menu, Play, Share2, ShieldCheck, Terminal, X } from "lucide-react";
import { useGameStore } from "../../store/gameStore";
import { LearnPanel } from "../learn/LearnPanel";
import { ReferencePanel } from "../reference/ReferencePanel";
import { buildEvaluationTrace, buildFailureDiagnosis } from "../../lib/evaluation";
import { getLearningLesson } from "../../lib/learning";
import { learningTracks } from "../../lib/tracks";
import {
    buildShareUrl,
    formatDecision,
    getEarnedBadges,
    isLevelUnlocked,
    getNextLevelId,
    getTotalXp,
    readSharedCompletion
} from "../../lib/progress";
import type { EvaluationLog, LevelTest } from "../../lib/types";

type TestRun = LevelTest & {
    suite: 'Visible' | 'Hidden';
};

type WorkspaceMode = 'challenge' | 'learn' | 'reference';
type ChallengePane = 'editor' | 'input' | 'tests' | 'feedback';

const now = () => new Date().toLocaleTimeString();

export default function Dashboard() {
    const {
        currentLevelId,
        completedLevels,
        streak,
        bestStreak,
        setCurrentLevel,
        completeLevel
    } = useGameStore();

    const currentLevel = levels.find(l => l.id === currentLevelId) || levels[0];
    const [code, setCode] = useState(currentLevel.starterPolicy);
    const [logs, setLogs] = useState<EvaluationLog[]>([]);
    const [showWinModal, setShowWinModal] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const [lastXpAward, setLastXpAward] = useState(0);
    const [shareCopied, setShareCopied] = useState(false);
    const [sharedCompletion] = useState(() => readSharedCompletion());
    const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('challenge');
    const [challengePane, setChallengePane] = useState<ChallengePane>('editor');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const totalXp = getTotalXp(completedLevels);
    const badges = getEarnedBadges(completedLevels, bestStreak);
    const earnedBadges = badges.filter((badge) => badge.earned);
    const nextBadge = badges.find((badge) => !badge.earned);
    const progressPercent = Math.round((completedLevels.length / levels.length) * 100);
    const sampleInput = currentLevel.visibleTests[0]?.input ?? {};
    const learningLesson = getLearningLesson(currentLevel.id);
    const canChallengeCurrentLevel = isLevelUnlocked(currentLevel.id, completedLevels, levels)
        || completedLevels.includes(currentLevel.id);
    const activeWorkspaceMode = workspaceMode === 'challenge' && !canChallengeCurrentLevel
        ? 'learn'
        : workspaceMode;

    useEffect(() => {
        const level = levels.find(l => l.id === currentLevelId);
        if (level) {
            setCode(level.starterPolicy);
            setHintIndex(0);
            setShareCopied(false);
            setLogs([{
                type: 'info',
                message: `Loaded ${level.title}`,
                timestamp: now()
            }]);
        }
    }, [currentLevelId]);

    const appendLog = (type: EvaluationLog['type'], message: string, details?: EvaluationLog['details']) => {
        setLogs(prev => [...prev, { type, message, details, timestamp: now() }]);
    };

    const handleLevelSelect = (id: string, isChallengeUnlocked: boolean) => {
        setCurrentLevel(id);
        setSidebarOpen(false);
        setChallengePane('editor');
        if (!isChallengeUnlocked) {
            setWorkspaceMode('learn');
        }
    };

    const handleNextLevel = () => {
        const nextLevelId = getNextLevelId(currentLevelId);
        if (nextLevelId) {
            setCurrentLevel(nextLevelId);
            setShowWinModal(false);
        }
    };

    const handleHint = () => {
        const totalHints = currentLevel.hints.length;

        if (totalHints === 0) {
            appendLog('info', 'No hints available for this level.');
            return;
        }

        if (hintIndex >= totalHints) {
            appendLog('info', 'No more hints left for this level.');
            return;
        }

        const hintNumber = hintIndex + 1;
        const hint = currentLevel.hints[hintIndex];
        appendLog('info', `Hint ${hintNumber}/${totalHints}: ${hint}`);
        setHintIndex(hintNumber);
    };

    const handleCopyShare = async () => {
        const shareUrl = buildShareUrl(completedLevels, bestStreak);

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            appendLog('success', 'Share link copied.');
        } catch {
            setShareCopied(false);
            appendLog('info', `Share link: ${shareUrl}`);
        }
    };

    const handleEvaluate = async () => {
        const newLogs: EvaluationLog[] = [];
        const addLog = (type: EvaluationLog['type'], message: string, details?: EvaluationLog['details']) => {
            newLogs.push({ type, message, details, timestamp: now() });
            setLogs([...newLogs]);
        };

        addLog('info', 'Compiling policy...');
        setChallengePane('feedback');

        try {
            const response = await fetch('/api/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rego: code }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                addLog('error', `Compilation failed: ${errorText}`);
                return;
            }

            const wasmBuffer = await response.arrayBuffer();
            addLog('success', 'Compilation successful. Running policy tests...');

            const { OPARuntime } = await import('../../lib/opa');
            const opa = new OPARuntime();
            await opa.load(wasmBuffer);

            const tests: TestRun[] = [
                ...currentLevel.visibleTests.map((test) => ({ ...test, suite: 'Visible' as const })),
                ...currentLevel.hiddenTests.map((test) => ({ ...test, suite: 'Hidden' as const }))
            ];

            let allPassed = true;
            for (const test of tests) {
                const result = opa.evaluate(test.input);
                const passed = result === test.expectedResult;
                const details: EvaluationLog['details'] = {
                    testName: test.name,
                    suite: test.suite,
                    input: test.input,
                    expected: test.expectedResult,
                    actual: result,
                    hint: test.hint,
                    trace: buildEvaluationTrace(currentLevel, test, result),
                    diagnosis: passed ? undefined : buildFailureDiagnosis(currentLevel, test, result)
                };

                if (passed) {
                    addLog('success', `[PASS] ${test.suite}: ${test.name}`, details);
                } else {
                    addLog('error', `[FAIL] ${test.suite}: ${test.name}`, details);
                    allPassed = false;
                }
            }

            if (allPassed) {
                const isNewCompletion = !completedLevels.includes(currentLevelId);
                setLastXpAward(isNewCompletion ? currentLevel.xp : 0);

                if (isNewCompletion) {
                    completeLevel(currentLevelId);
                }

                addLog('success', `All tests passed. ${isNewCompletion ? `+${currentLevel.xp} points awarded.` : 'Level already completed.'}`);
                setShowWinModal(true);
            } else {
                addLog('info', 'Fix the failed decision above and run the tests again.');
            }

        } catch (e) {
            addLog('error', `System error: ${e}`);
        }
    };

    const visibleTestsPanel = (
        <div className="h-full overflow-y-auto border-b border-slate-200 bg-white p-4 xl:h-auto xl:border-b">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <ClipboardCheck size={14} />
                Visible tests
            </div>
            <div className="space-y-2">
                {currentLevel.visibleTests.map((test) => (
                    <div key={test.name} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-[#f8fafc] px-3 py-2 text-sm">
                        <span className="min-w-0 truncate text-slate-700">{test.name}</span>
                        <span className={test.expectedResult ? 'text-emerald-700' : 'text-rose-700'}>
                            {formatDecision(test.expectedResult)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={13} />
                {currentLevel.hiddenTests.length} hidden edge {currentLevel.hiddenTests.length === 1 ? 'case' : 'cases'} run on evaluate
            </div>
        </div>
    );

    const sidebarContent = (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">
                            REGO DOJO
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Policy training for cloud teams</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-700 shadow-sm shadow-slate-200/70">
                        <BookOpen size={20} />
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{progressPercent}% complete</span>
                        <span>{completedLevels.length}/{levels.length} levels</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <LevelSelect
                    levels={levels}
                    categories={levelCategories}
                    currentLevelId={currentLevelId}
                    completedLevelIds={completedLevels}
                    bestStreak={bestStreak}
                    tracks={learningTracks}
                    onSelectLevel={handleLevelSelect}
                />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-xs text-slate-500">Points</div>
                        <div className="text-sm font-semibold text-slate-950">{totalXp}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Run</div>
                        <div className="text-sm font-semibold text-slate-950">{streak}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Milestones</div>
                        <div className="text-sm font-semibold text-slate-950">{earnedBadges.length}</div>
                    </div>
                </div>
                {nextBadge && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-[#f8fafc] p-2 text-xs text-slate-500">
                        Next milestone: <span className="text-slate-800">{nextBadge.title}</span>
                    </div>
                )}
                <div className="mt-3 text-center text-xs text-slate-500">
                    v0.2.0 - OPA WASM
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-dvh overflow-hidden bg-[#f6f8fb] text-slate-900 lg:h-screen">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <button
                        className="absolute inset-0 bg-slate-950/30"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close course drawer"
                    />
                    <aside className="relative z-10 flex h-full w-[min(21rem,88vw)] flex-col border-r border-slate-200 bg-[#f8fafc] shadow-xl">
                        <button
                            className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close course drawer"
                        >
                            <X size={18} />
                        </button>
                        {sidebarContent}
                    </aside>
                </div>
            )}

            <aside className="hidden w-80 shrink-0 flex-col border-r border-slate-200 bg-[#f8fafc] lg:flex">
                {sidebarContent}
            </aside>

            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                        <Menu size={17} />
                        Course
                    </button>
                    <div className="text-right">
                        <div className="text-sm font-bold tracking-tight text-slate-950">REGO DOJO</div>
                        <div className="text-xs text-slate-500">{completedLevels.length}/{levels.length} complete</div>
                    </div>
                </div>
                <header className="min-h-16 border-b border-slate-200 bg-white flex flex-col gap-3 px-6 py-3 shrink-0 z-10 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
                    <div className="w-full min-w-0 xl:max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-lg font-semibold text-slate-950">{currentLevel.title}</h1>
                            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">{currentLevel.difficulty}</span>
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{currentLevel.xp} pts</span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 max-w-3xl break-words">{currentLevel.prompt}</p>
                    </div>
                    <div className="flex w-full shrink-0 flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                            <button
                                onClick={() => setWorkspaceMode('challenge')}
                                disabled={!canChallengeCurrentLevel}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:text-slate-300 ${activeWorkspaceMode === 'challenge'
                                    ? 'bg-white text-slate-950 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                title={canChallengeCurrentLevel ? 'Open challenge workspace' : 'Complete earlier challenges to unlock this exercise.'}
                            >
                                <Code2 size={15} />
                                Challenge
                            </button>
                            <button
                                onClick={() => setWorkspaceMode('learn')}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${activeWorkspaceMode === 'learn'
                                    ? 'bg-white text-slate-950 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <BookOpen size={15} />
                                Learn
                            </button>
                            <button
                                onClick={() => setWorkspaceMode('reference')}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${activeWorkspaceMode === 'reference'
                                    ? 'bg-white text-slate-950 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <Library size={15} />
                                Reference
                            </button>
                        </div>
                        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 py-2 text-sm text-slate-600 lg:flex">
                            <ShieldCheck size={16} className="text-emerald-700" />
                            {streak} run streak
                        </div>
                        <button
                            onClick={handleCopyShare}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                        >
                            <Share2 size={16} />
                            {shareCopied ? 'Copied' : 'Share'}
                        </button>
                    </div>
                </header>

                {sharedCompletion && (
                    <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-2 text-sm text-emerald-900">
                        Shared completion: {sharedCompletion.badge} - {sharedCompletion.completed} levels - {sharedCompletion.xp} points
                    </div>
                )}

                {activeWorkspaceMode === 'reference' ? (
                    <ReferencePanel currentLesson={learningLesson} />
                ) : activeWorkspaceMode === 'learn' ? (
                    <LearnPanel level={currentLevel} lesson={learningLesson} />
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
                        <div className="grid grid-cols-4 gap-1 border-b border-slate-200 bg-[#f8fafc] p-2 xl:hidden">
                            {[
                                { id: 'editor' as const, label: 'Editor', icon: Code2 },
                                { id: 'input' as const, label: 'Input', icon: FileJson },
                                { id: 'tests' as const, label: 'Tests', icon: ListChecks },
                                { id: 'feedback' as const, label: 'Feedback', icon: Terminal }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setChallengePane(id)}
                                    className={`flex min-w-0 flex-col items-center gap-1 rounded-md px-2 py-2 text-xs transition-colors ${challengePane === id
                                        ? 'bg-white text-emerald-800 shadow-sm'
                                        : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
                                        }`}
                                >
                                    <Icon size={15} />
                                    <span className="truncate">{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="hidden min-h-0 flex-1 overflow-hidden xl:flex">
                            <div className="relative flex min-w-0 flex-1 flex-col border-r border-slate-200 bg-white">
                                <PolicyEditor
                                    code={code}
                                    onChange={(val) => setCode(val || "")}
                                />
                            </div>

                            <div className="flex w-[430px] shrink-0 flex-col bg-[#f8fafc]">
                                <div className="h-[42%] min-h-[220px] border-b border-slate-200">
                                    <InputViewer data={sampleInput} title={`${currentLevel.visibleTests[0]?.name ?? 'Visible test'} input`} />
                                </div>

                                {visibleTestsPanel}

                                <div className="min-h-[220px] flex-1">
                                    <Console logs={logs} />
                                </div>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-hidden xl:hidden">
                            {challengePane === 'editor' && (
                                <PolicyEditor
                                    code={code}
                                    onChange={(val) => setCode(val || "")}
                                />
                            )}
                            {challengePane === 'input' && (
                                <InputViewer data={sampleInput} title={`${currentLevel.visibleTests[0]?.name ?? 'Visible test'} input`} />
                            )}
                            {challengePane === 'tests' && visibleTestsPanel}
                            {challengePane === 'feedback' && <Console logs={logs} />}
                        </div>
                    </div>
                )}

                <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 lg:h-16 lg:px-6 lg:py-0">
                    <button
                        onClick={activeWorkspaceMode === 'reference'
                            ? () => setWorkspaceMode('learn')
                            : activeWorkspaceMode === 'learn'
                                ? () => setWorkspaceMode(canChallengeCurrentLevel ? 'challenge' : 'learn')
                                : handleHint}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={(activeWorkspaceMode === 'challenge' && currentLevel.hints.length === 0) || (activeWorkspaceMode === 'learn' && !canChallengeCurrentLevel)}
                    >
                        {activeWorkspaceMode === 'reference'
                            ? <BookOpen size={16} />
                            : activeWorkspaceMode === 'learn'
                                ? <Code2 size={16} />
                                : <Lightbulb size={16} />}
                        <span>{activeWorkspaceMode === 'reference'
                            ? 'Current lesson'
                            : activeWorkspaceMode === 'learn'
                                ? (canChallengeCurrentLevel ? 'Back to challenge' : 'Challenge locked')
                                : 'Need a hint?'}</span>
                    </button>

                    <button
                        onClick={activeWorkspaceMode === 'reference'
                            ? () => setWorkspaceMode(canChallengeCurrentLevel ? 'challenge' : 'learn')
                            : activeWorkspaceMode === 'learn'
                                ? () => setWorkspaceMode(canChallengeCurrentLevel ? 'challenge' : 'learn')
                                : handleEvaluate}
                        disabled={activeWorkspaceMode === 'learn' && !canChallengeCurrentLevel}
                        className="group relative flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white shadow-sm shadow-emerald-700/20 transition-all hover:bg-emerald-600 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none lg:px-8"
                    >
                        {activeWorkspaceMode === 'challenge'
                            ? <Play size={18} className="fill-current" />
                            : <Code2 size={18} />}
                        {activeWorkspaceMode === 'reference'
                            ? (canChallengeCurrentLevel ? 'Open Challenge' : 'Open Lesson')
                            : activeWorkspaceMode === 'learn'
                                ? (canChallengeCurrentLevel ? 'Open Challenge' : 'Complete Previous Level')
                                : 'Evaluate Policy'}
                        <div className="absolute inset-0 rounded-lg ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
                    </button>
                </footer>

                <WinModal
                    isOpen={showWinModal}
                    levelTitle={currentLevel.title}
                    successExplanation={currentLevel.successExplanation}
                    xpAward={lastXpAward}
                    streak={streak}
                    shareCopied={shareCopied}
                    onNextLevel={handleNextLevel}
                    onClose={() => setShowWinModal(false)}
                    onCopyShare={handleCopyShare}
                    isLastLevel={levels.indexOf(currentLevel) === levels.length - 1}
                />
            </main>
        </div>
    )
}
