import { BookOpen, BriefcaseBusiness, CheckCircle2, Circle, Code2, Lock, Route } from 'lucide-react';
import { useMemo, useState } from 'react';
import { capstoneProjects, getCapstoneReadiness } from '../../lib/capstones';
import { levels } from '../../levels';
import { learningTracks } from '../../lib/tracks';

interface CapstonePanelProps {
  completedLevelIds: string[];
  onSelectLevel: (levelId: string, isChallengeUnlocked: boolean) => void;
}

export const CapstonePanel = ({ completedLevelIds, onSelectLevel }: CapstonePanelProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState(capstoneProjects[0].id);
  const selectedProject = capstoneProjects.find((project) => project.id === selectedProjectId) ?? capstoneProjects[0];
  const selectedTrack = learningTracks.find((track) => track.id === selectedProject.trackId);
  const readiness = getCapstoneReadiness(selectedProject, completedLevelIds);

  const prerequisiteLevels = useMemo(
    () => selectedProject.prerequisiteLevelIds
      .map((levelId) => levels.find((level) => level.id === levelId))
      .filter((level) => Boolean(level)),
    [selectedProject.prerequisiteLevelIds]
  );

  const nextPrerequisiteId = readiness.remainingPrerequisites[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f8fb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <BriefcaseBusiness size={15} />
                Capstone projects
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Build a coherent policy from the lessons.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Use these project briefs after a few levels to turn isolated Rego patterns into production-shaped policies.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Current readiness</span>
                <span>{readiness.percent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${readiness.percent}%` }} />
              </div>
              <div className="mt-3 text-sm text-slate-700">
                {readiness.ready
                  ? 'All prerequisites are complete. This project is ready for an independent attempt.'
                  : `${readiness.remainingPrerequisites.length} prerequisite ${readiness.remainingPrerequisites.length === 1 ? 'lesson remains' : 'lessons remain'}.`}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-3">
            {capstoneProjects.map((project) => {
              const projectReadiness = getCapstoneReadiness(project, completedLevelIds);
              const isActive = project.id === selectedProject.id;

              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${isActive
                    ? 'border-emerald-300 bg-emerald-50 text-slate-950 shadow-sm shadow-emerald-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{project.title}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{project.summary}</p>
                    </div>
                    {projectReadiness.ready ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-700" />
                    ) : (
                      <Lock size={17} className="shrink-0 text-slate-400" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-500">
                      {project.difficulty}
                    </span>
                    <span className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-[10px] text-emerald-800">
                      {projectReadiness.percent}% ready
                    </span>
                  </div>
                </button>
              );
            })}
          </aside>

          <div className="flex flex-col gap-6">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Route size={14} />
                    {selectedTrack?.title ?? 'Policy project'}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">{selectedProject.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{selectedProject.scenario}</p>
                </div>
                <span className={`rounded border px-2 py-1 text-xs ${readiness.ready
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
                  }`}>
                  {readiness.ready ? 'Ready' : 'Build up first'}
                </span>
              </div>

              <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                Outcome: {selectedProject.outcome}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Deliverables</div>
                  <div className="flex flex-col gap-2">
                    {selectedProject.deliverables.map((deliverable) => (
                      <div key={deliverable} className="flex gap-2 text-sm leading-6 text-slate-700">
                        <Circle size={13} className="mt-1.5 shrink-0 text-slate-400" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Acceptance checks</div>
                  <div className="flex flex-col gap-2">
                    {selectedProject.acceptanceChecks.map((check) => (
                      <div key={check} className="flex gap-2 text-sm leading-6 text-slate-700">
                        <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-700" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Code2 size={14} />
                  Starter policy
                </div>
                <pre className="max-h-[460px] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100"><code>{selectedProject.starterPolicy}</code></pre>
              </div>

              <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <BookOpen size={14} />
                  Prerequisites
                </div>
                <div className="flex flex-col gap-2">
                  {prerequisiteLevels.map((level) => {
                    if (!level) {
                      return null;
                    }

                    const isComplete = completedLevelIds.includes(level.id);
                    return (
                      <button
                        key={level.id}
                        onClick={() => onSelectLevel(level.id, true)}
                        className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        {isComplete ? (
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />
                        ) : (
                          <Circle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-800">{level.title}</div>
                          <div className="mt-1 text-xs text-slate-500">{isComplete ? 'Completed' : 'Study lesson'}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {nextPrerequisiteId && (
                  <button
                    onClick={() => onSelectLevel(nextPrerequisiteId, false)}
                    className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    Study next prerequisite
                  </button>
                )}
              </aside>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};
