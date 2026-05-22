import { AlertCircle, CheckCircle2, Circle, ShieldAlert, Terminal } from "lucide-react";
import { formatDecision } from "../../lib/progress";
import type { EvaluationLog } from "../../lib/types";

interface ConsoleProps {
    logs: EvaluationLog[];
}

export const Console = ({ logs }: ConsoleProps) => {
    return (
        <div className="h-full flex flex-col bg-white text-slate-700 font-mono text-sm">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-[#f8fafc]">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Feedback</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {logs.length === 0 && (
                    <div className="text-slate-400 italic">Ready to evaluate...</div>
                )}

                {logs.map((log, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">
                        <div className="flex gap-3">
                            <span className="text-slate-400 shrink-0 select-none">[{log.timestamp}]</span>
                            <div className="flex items-start gap-2 min-w-0">
                                {log.type === 'error' && <ShieldAlert size={16} className="text-rose-600 mt-0.5 shrink-0" />}
                                {log.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />}
                                <span className={
                                    log.type === 'error' ? 'text-rose-700' :
                                        log.type === 'success' ? 'text-emerald-700' :
                                            'text-slate-600'
                                }>
                                    {log.message}
                                </span>
                            </div>
                        </div>

                        {log.details && (
                            <details
                                open={log.type === 'error'}
                                className={`mt-2 ml-[6.5rem] rounded-md border p-3 text-xs text-slate-800 ${log.type === 'error'
                                    ? 'border-rose-200 bg-rose-50'
                                    : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Evaluation trace
                                </summary>

                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    <div>
                                        <div className="text-slate-500 uppercase tracking-wider">Test</div>
                                        <div className={log.type === 'error' ? 'text-rose-800' : 'text-slate-800'}>
                                            {log.details.suite}: {log.details.testName}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 uppercase tracking-wider">Expected</div>
                                        <div className="text-emerald-700">{formatDecision(log.details.expected)}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 uppercase tracking-wider">Actual</div>
                                        <div className={log.details.actual === log.details.expected ? 'text-emerald-700' : 'text-rose-700'}>
                                            {formatDecision(log.details.actual)}
                                        </div>
                                    </div>
                                </div>

                                {log.details.diagnosis && (
                                    <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-slate-700">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-600" />
                                            <div>
                                                <div className="font-semibold text-rose-800">{log.details.diagnosis.summary}</div>
                                                <div className="mt-2">
                                                    Inspect <span className="font-semibold text-slate-900">{log.details.diagnosis.inputPath}</span>.
                                                </div>
                                                <div className="mt-1">{log.details.diagnosis.nextStep}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {log.details.trace && (
                                    <div className="mt-3 overflow-hidden rounded-md border border-slate-200 bg-white">
                                        {log.details.trace.map((step, index) => (
                                            <div key={`${step.label}-${index}`} className="grid grid-cols-[22px_minmax(0,1fr)] gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0">
                                                {step.status === 'pass' && <CheckCircle2 size={14} className="mt-0.5 text-emerald-600" />}
                                                {step.status === 'fail' && <ShieldAlert size={14} className="mt-0.5 text-rose-600" />}
                                                {step.status === 'info' && <Circle size={14} className="mt-0.5 text-slate-400" />}
                                                <div>
                                                    <div className="font-semibold text-slate-800">{step.label}</div>
                                                    <div className="mt-0.5 leading-relaxed text-slate-600">{step.detail}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {log.type === 'error' && (
                                    <>
                                        <pre className="mt-3 max-h-44 overflow-auto rounded border border-rose-100 bg-white p-3 text-[11px] leading-relaxed text-slate-700">
                                            {JSON.stringify(log.details.input, null, 2)}
                                        </pre>
                                        <div className="mt-3 text-slate-700">
                                            Hint: {log.details.hint}
                                        </div>
                                    </>
                                )}
                            </details>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
