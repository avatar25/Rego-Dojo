import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface WinModalProps {
    isOpen: boolean;
    levelTitle: string;
    onNextLevel: () => void;
    onClose: () => void;
    isLastLevel?: boolean;
}

export const WinModal = ({ isOpen, levelTitle, onNextLevel, onClose, isLastLevel = false }: WinModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#10b981', '#34d399', '#059669']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#10b981', '#34d399', '#059669']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl p-8 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20">
                                <Trophy size={40} className="text-emerald-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Policy Authorized!</h2>
                        <p className="text-slate-400 mb-8">
                            You've successfully completed <span className="text-emerald-400">{levelTitle}</span>.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                            >
                                Stay Here
                            </button>

                            {!isLastLevel && (
                                <button
                                    onClick={onNextLevel}
                                    className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-semibold shadow-lg shadow-emerald-900/20 flex items-center gap-2"
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
