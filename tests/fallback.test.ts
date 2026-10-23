import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fallbackAnalysis } from "../src/lib/ai-fallback";
import { toCsv } from "../src/lib/csv";

const rows = [
  { entity: "TaskInventory", record: { id: "t1", name: "Weekly invoice entry", classification: "automate" } },
  { entity: "SkillGap", record: { id: "s1", skill: "Data analysis", gapScore: 0 } },
];

test("deterministic fallback labels itself and never claims AI generation", () => {
  for (const workflow of ["task-classify", "exposure-forecast", "plan-generate"]) {
    const result = fallbackAnalysis(workflow, { task: "Weekly invoice entry", frequency: "weekly", headcount: "12" }, rows);
    assert.equal(result.aiGenerated, false);
    assert.equal(result.source, "deterministic-fallback");
    assert.equal(result.confidence, null);
    assert.ok(result.summary.length > 0);
    assert.ok(result.citations.includes("TaskInventory:t1"));
  }
});

test("fallback preserves zero values from records in its findings", () => {
  const result = fallbackAnalysis("plan-generate", { currentRole: "Analyst", targetRole: "Data analyst" }, rows);
  assert.ok(result.findings.some((f) => f.includes("Data analysis")));
});

test("CSV export keeps false and zero cells", () => {
  const csv = toCsv([{ name: "A", active: false, score: 0 }]);
  assert.ok(csv.includes("A,false,0"));
});

test("records export and AI fallback are wired into the routes", () => {
  const records = readFileSync("src/app/api/records/[entity]/route.ts", "utf8");
  assert.ok(records.includes('format') && records.includes("csvResponse"));
  const ai = readFileSync("src/app/api/ai/[workflow]/route.ts", "utf8");
  assert.ok(ai.includes("fallbackAnalysis"));
  assert.ok(!ai.includes("AI is unavailable: configure the provider"));
});
