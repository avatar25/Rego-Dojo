import Editor from "@monaco-editor/react";
import type { JsonObject } from "../../lib/types";

interface InputViewerProps {
    data: JsonObject;
    title?: string;
}

export const InputViewer = ({ data, title = 'Sample Input' }: InputViewerProps) => {
    const jsonString = JSON.stringify(data, null, 2);

    return (
        <div className="h-full w-full bg-[#1e1e1e] border-l border-slate-800">
            <div className="h-8 bg-slate-900 flex items-center px-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
            </div>
            <Editor
                height="calc(100% - 2rem)"
                defaultLanguage="json"
                value={jsonString}
                theme="vs-dark"
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "off",
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                }}
            />
        </div>
    );
};
