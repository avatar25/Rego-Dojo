import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";
import { useRef } from "react";

interface PolicyEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    readOnly?: boolean;
}

let regoLanguageConfigured = false;

export const PolicyEditor = ({ code, onChange, readOnly = false }: PolicyEditorProps) => {
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        if (!monaco.languages.getLanguages().some((language: { id: string }) => language.id === 'rego')) {
            monaco.languages.register({ id: 'rego' });
        }

        if (regoLanguageConfigured) {
            return;
        }

        regoLanguageConfigured = true;

        monaco.languages.setMonarchTokensProvider('rego', {
            keywords: [
                'package',
                'import',
                'default',
                'else',
                'not',
                'some',
                'with',
                'if',
                'contains',
                'true',
                'false',
                'null'
            ],
            builtins: [
                'startswith',
                'endswith',
                'contains',
                'count',
                'concat',
                'sprintf',
                'lower',
                'upper',
                'is_string',
                'is_number',
                'is_boolean',
                'object.get'
            ],
            tokenizer: {
                root: [
                    [/#.*$/, 'comment'],
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                    [/\b(package|import|default|else|not|some|with|if|true|false|null)\b/, 'keyword'],
                    [/\b(startswith|endswith|contains|count|concat|sprintf|lower|upper|is_string|is_number|is_boolean)\b/, 'predefined'],
                    [/[{}()[\]]/, '@brackets'],
                    [/[a-zA-Z_][\w.]*/, 'identifier'],
                    [/[0-9]+/, 'number'],
                    [/[=!:<>+\-*/]+/, 'operator']
                ],
                string: [
                    [/[^\\"]+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ]
            }
        });

        monaco.languages.registerCompletionItemProvider('rego', {
            provideCompletionItems: (model: editor.ITextModel, position: Position) => {
                const word = model.getWordUntilPosition(position);
                const range = new monaco.Range(
                    position.lineNumber,
                    word.startColumn,
                    position.lineNumber,
                    word.endColumn
                );

                return {
                    suggestions: [
                        {
                            label: 'allow rule',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: ['allow {', '  ${1:true}', '}'].join('\n'),
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Create an allow rule whose body must be proven true.',
                            range
                        },
                        {
                            label: 'unsafe helper',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: ['${1:violation} {', '  ${2:input.path == true}', '}', '', 'allow {', '  not ${1:violation}', '}'].join('\n'),
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Name the unsafe condition, then allow only when it is absent.',
                            range
                        },
                        {
                            label: 'list membership',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: '${1:input.actor.groups}[_] == "${2:deployers}"',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Use [_] to require that at least one list item matches.',
                            range
                        },
                        {
                            label: 'startswith',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'startswith(${1:value}, "${2:prefix}")',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Returns true when a string begins with a prefix.',
                            range
                        },
                        {
                            label: 'endswith',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'endswith(${1:value}, "${2:suffix}")',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Returns true when a string ends with a suffix.',
                            range
                        }
                    ]
                };
            }
        });

        monaco.languages.registerHoverProvider('rego', {
            provideHover: (_model: editor.ITextModel, position: Position) => {
                const word = editor.getModel()?.getWordAtPosition(position)?.word;
                const docs: Record<string, string> = {
                    input: 'The JSON request currently being evaluated.',
                    default: 'Sets the value used when no rule proves another result.',
                    allow: 'The boolean decision Rego Dojo evaluates at play/allow.',
                    not: 'True when Rego cannot prove the expression that follows.',
                    some: 'Introduces local variables for iteration and search.',
                    startswith: 'String built-in for approved registry or prefix checks.',
                    endswith: 'String built-in for tag and suffix checks.',
                    contains: 'String built-in for checking whether text includes a substring.'
                };

                if (!word || !docs[word]) {
                    return null;
                }

                return {
                    contents: [{ value: `**${word}**\n\n${docs[word]}` }]
                };
            }
        });
    };

    return (
        <div className="h-full w-full bg-white">
            <Editor
                height="100%"
                defaultLanguage="rego"
                language="rego"
                value={code}
                onChange={onChange}
                theme="vs"
                options={{
                    readOnly,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
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
