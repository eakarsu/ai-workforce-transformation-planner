// Deterministic offline fallback for the three workforce workflows.
// Used only when no provider key is configured; never calls a provider.
// Every result is labelled aiGenerated:false so the UI can show it honestly.

export type EvidenceRow = { entity: string; record: Record<string, unknown> };
export type FallbackResult = {
  status: "draft"; summary: string; findings: string[]; recommendations: string[];
  citations: string[]; limitations: string[]; riskLevel: null; confidence: null;
  aiGenerated: false; source: "deterministic-fallback";
};

const text = (v: unknown) => (v == null ? "" : String(v));
const has = (v: unknown, words: string[]) => words.some((w) => text(v).toLowerCase().includes(w));

function base(rows: EvidenceRow[], summary: string, findings: string[], recommendations: string[]): FallbackResult {
  return {
    status: "draft", summary, findings, recommendations,
    citations: rows.map((r) => `${r.entity}:${text(r.record.id)}`),
    limitations: ["Deterministic fallback computed locally from the selected records; it is not AI-generated and has not been reviewed by a model."],
    riskLevel: null, confidence: null, aiGenerated: false, source: "deterministic-fallback",
  };
}

export function fallbackAnalysis(workflow: string, input: Record<string, unknown>, rows: EvidenceRow[]): FallbackResult {
  if (workflow === "task-classify") {
    const task = text(input.task) || text(rows[0]?.record.name) || "the selected task";
    const judgement = has(input.judgmentRequired, ["legal", "clinical", "safety", "judgment", "judgement", "discretion"]);
    const routine = has(input.frequency, ["daily", "hourly", "weekly"]) || has(task, ["report", "entry", "schedule", "invoice"]);
    const label = judgement ? "human-only" : routine ? "automate" : "ai-assisted";
    return base(rows,
      `Deterministic classification for "${task}": ${label}.`,
      [`Classification: ${label} (rule-based, from frequency and judgement signals in your records).`, `Evidence records considered: ${rows.length}.`],
      [label === "human-only" ? "Keep a named human owner and review cadence for this task." : "Pilot with human review before changing staffing or tooling.", "Re-run with the provider configured for a model draft."]);
  }
  if (workflow === "exposure-forecast") {
    const tasks = rows.filter((r) => r.entity === "TaskInventory");
    const exposed = tasks.filter((r) => has(r.record.classification, ["automate", "ai-assisted"])).length;
    const pct = tasks.length ? Math.round((exposed / tasks.length) * 100) : 0;
    return base(rows,
      `Deterministic exposure summary: ${exposed} of ${tasks.length} inventoried tasks are classified automate or AI-assisted (${pct}%).`,
      [`Tasks inventoried: ${tasks.length}.`, `Exposed tasks: ${exposed} (${pct}%).`, `Headcount in scope: ${text(input.headcount) || "not provided"}.`],
      ["Validate each exposed task with its owner before any workforce decision.", "Model redeployment and reskilling capacity against the exposed share."]);
  }
  // plan-generate
  const gaps = rows.filter((r) => r.entity === "SkillGap");
  const skills = gaps.map((r) => text(r.record.skill)).filter(Boolean);
  return base(rows,
    `Deterministic reskilling outline from ${text(input.currentRole) || "current role"} to ${text(input.targetRole) || "target role"} using ${gaps.length} recorded skill gaps.`,
    skills.length ? skills.map((s) => `Recorded skill gap: ${s}.`) : ["No SkillGap records were selected; add skill gaps to personalise this outline."],
    [...skills.map((s) => `Schedule training for: ${s}.`), "Confirm time budget and manager approval before enrolling."]);
}
