import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';
import type { Level } from '../../lib/types';
import type { LearningLesson } from '../../lib/learning';
import { getTracksForLevel } from '../../lib/tracks';

interface LearnPanelProps {
  level: Level;
  lesson: LearningLesson;
}

export const LearnPanel = ({ level, lesson }: LearnPanelProps) => {
  const tracks = getTracksForLevel(level.id);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f8fb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
          <div className="grid min-h-[260px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between gap-8 p-6 lg:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  <BookOpen size={15} />
                  Concept bridge
                </div>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-950">
                  {lesson.concept}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  {lesson.creatureWorld}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  {lesson.productionUseCase}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">{level.title}</span>
                <ArrowRight size={16} className="text-slate-400" />
                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800">
                  {level.difficulty}
                </span>
                {tracks.map((track) => (
                  <span key={track.id} className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-600">
                    {track.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="relative mx-auto flex aspect-[4/3] max-w-md items-center justify-center">
                <div className="absolute left-3 top-6 h-24 w-24 rounded-full border border-amber-200 bg-amber-50" />
                <div className="absolute bottom-7 right-4 h-28 w-28 rounded-full border border-sky-200 bg-sky-50" />
                <div className="relative z-10 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <Sparkles size={20} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">Analogy</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">creature facts make the rule shape visible</div>
                  </div>
                  <GitBranch size={22} className="text-slate-400" />
                  <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">Production rule</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">apply the same pattern to real requests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Analogy input</div>
              <pre className="max-h-[420px] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100"><code>{lesson.sampleInput}</code></pre>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Production Rego pattern</div>
              <pre className="max-h-[420px] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100"><code>{lesson.samplePolicy}</code></pre>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">How it maps</div>
              <p className="text-sm leading-6 text-slate-700">{lesson.regoPattern}</p>
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                {lesson.bridge}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <BriefcaseBusiness size={14} />
                Production context
              </div>
              <p className="text-sm leading-6 text-slate-700">{lesson.productionUseCase}</p>
              {tracks.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {tracks.map((track) => (
                    <div key={track.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="text-sm font-semibold text-slate-900">{track.title}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{track.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Checkpoints</div>
              <div className="flex flex-col gap-3">
                {lesson.checkpoints.map((checkpoint) => (
                  <div key={checkpoint} className="flex gap-3 text-sm leading-5 text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />
                    <span>{checkpoint}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};
