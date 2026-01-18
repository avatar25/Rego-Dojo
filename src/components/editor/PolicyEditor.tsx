import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";

interface PolicyEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    readOnly?: boolean;
}

export const PolicyEditor = ({ code, onChange, readOnly = false }: PolicyEditorProps) => {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, _monaco) => {
        editorRef.current = editor;

        // Define a basic Rego theme if not already present
        // Note: Monaco might autodetect 'rego' if we installed a language pack, 
        // but by default we use 'ruby' or 'python' as a fallback if rego isn't available,
        // or register a custom tokenizer. For now, let's try 'python' for basic highlighting
        // or keep it simple.

        // Ideally we would register a real Rego language definition here.
        // For MVP, 'python' is close enough visually (def, if, # comments).
        // Or we can just use 'plaintext' if strict accuracy is needed.
    };

    return (
        <div className="h-full w-full bg-[#1e1e1e]">
            <Editor
                height="100%"
                defaultLanguage="python" // Fallback since 'rego' isn't standard in Monaco basic
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    fontLigatures: true,
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};
