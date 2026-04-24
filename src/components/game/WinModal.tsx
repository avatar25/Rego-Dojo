import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, CheckCircle2, Share2, X } from "lucide-react";

interface WinModalProps {
    isOpen: boolean;
    levelTitle: string;
    successExplanation: string;
    xpAward: number;
    streak: number;
    shareCopied: boolean;
    onNextLevel: () => void;
    onClose: () => void;
    onCopyShare: () => void;
    isLastLevel?: boolean;
}

export const WinModal = ({
    isOpen,
    levelTitle,
    successExplanation,
    xpAward,
    streak,
    shareCopied,
    onNextLevel,
    onClose,
    onCopyShare,
    isLastLevel = false
}: WinModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/15 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-900/12"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                                <CheckCircle2 size={34} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Level complete</h2>
                        <p className="mt-2 text-slate-600">
                            {levelTitle} is cleared.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{successExplanation}</p>

                        <div className="my-6 grid grid-cols-2 gap-3 text-left">
                            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                                    <Award size={14} />
                                    Points earned
                                </div>
                                <div className="mt-1 text-xl font-semibold text-slate-950">+{xpAward}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                                    <CheckCircle2 size={14} />
                                    Run streak
                                </div>
                                <div className="mt-1 text-xl font-semibold text-slate-950">{streak}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Stay Here
                            </button>

                            <button
                                onClick={onCopyShare}
                                className="flex items-center gap-2 rounded-lg border border-emerald-200 px-5 py-2.5 font-medium text-emerald-800 transition-colors hover:bg-emerald-50"
                            >
                                <Share2 size={18} />
                                {shareCopied ? 'Link copied' : 'Copy link'}
                            </button>

                            {!isLastLevel && (
                                <button
                                    onClick={onNextLevel}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white shadow-sm shadow-emerald-700/20 transition-colors hover:bg-emerald-600"
                                >
                                    Next Level
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
