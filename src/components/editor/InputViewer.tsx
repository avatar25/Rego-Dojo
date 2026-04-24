import Editor from "@monaco-editor/react";
import type { JsonObject } from "../../lib/types";

interface InputViewerProps {
    data: JsonObject;
    title?: string;
}

export const InputViewer = ({ data, title = 'Sample Input' }: InputViewerProps) => {
    const jsonString = JSON.stringify(data, null, 2);

    return (
        <div className="h-full w-full bg-white">
            <div className="h-9 bg-[#f8fafc] flex items-center px-4 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
            </div>
            <Editor
                height="calc(100% - 2.25rem)"
                defaultLanguage="json"
                value={jsonString}
                theme="vs"
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineHeight: 20,
                    lineNumbers: "off",
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                }}
            />
        </div>
    );
};
