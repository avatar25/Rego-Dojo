import { BookOpen, Library, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LearningLesson } from '../../lib/learning';
import { referenceTopics } from '../../lib/reference';

interface ReferencePanelProps {
  currentLesson: LearningLesson;
}

export const ReferencePanel = ({ currentLesson }: ReferencePanelProps) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTopics = useMemo(() => {
    if (!normalizedQuery) {
      return referenceTopics;
    }

    return referenceTopics.filter((topic) => {
      const searchable = [
        topic.title,
        topic.summary,
        topic.whenToUse,
        ...topic.examples.flatMap((example) => [example.title, example.note, example.code])
      ].join(' ').toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f8fb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Library size={15} />
                Rego handbook
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Reference for the patterns you are practicing.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Short examples for the concepts that show up across Rego Dojo levels.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Search reference</span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 focus-within:border-emerald-300 focus-within:bg-white">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try input, not, helper, startswith"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>

          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
            Current level concept: <span className="font-semibold">{currentLesson.conceptLabel}</span>. {currentLesson.regoPattern}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5">
          {filteredTopics.map((topic) => (
            <article key={topic.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <BookOpen size={14} />
                    {topic.title}
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-slate-700">{topic.summary}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500">
                  {topic.whenToUse}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {topic.examples.map((example) => (
                  <div key={example.title} className="overflow-hidden rounded-md border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900">{example.title}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{example.note}</p>
                    </div>
                    <pre className="overflow-auto bg-slate-950 p-4 text-xs leading-5 text-slate-100"><code>{example.code}</code></pre>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {filteredTopics.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No reference topics matched that search.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
