import { Terminal, ShieldAlert, CheckCircle2 } from "lucide-react";

interface LogEntry {
    type: 'info' | 'success' | 'error';
    message: string;
    timestamp: string;
}

interface ConsoleProps {
    logs: LogEntry[];
}

export const Console = ({ logs }: ConsoleProps) => {
    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-slate-300 font-mono text-sm border-t border-slate-800">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Console Output</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {logs.length === 0 && (
                    <div className="text-slate-600 italic">Ready to evaluate...</div>
                )}

                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                        <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                        <div className="flex items-start gap-2">
                            {log.type === 'error' && <ShieldAlert size={16} className="text-rose-500 mt-0.5 shrink-0" />}
                            {log.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />}
                            <span className={
                                log.type === 'error' ? 'text-rose-400' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                        'text-slate-300'
                            }>
                                {log.message}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
