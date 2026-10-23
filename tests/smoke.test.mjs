import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("start script fails closed: no swallowed migrations, secret required", () => {
  const start = readFileSync("start.sh", "utf8");
  assert.ok(!start.includes("|| true"), "start.sh must not swallow failures");
  assert.ok(start.includes("NEXTAUTH_SECRET"), "start.sh must require NEXTAUTH_SECRET");
  assert.ok(start.includes("prisma migrate deploy"), "start.sh must run plain prisma migrate deploy");
});

test("seed requires SEED_ADMIN_PASSWORD with no default", () => {
  const seed = readFileSync("prisma/seed.ts", "utf8");
  assert.ok(seed.includes("SEED_ADMIN_PASSWORD"), "seed must require SEED_ADMIN_PASSWORD");
  assert.ok(!seed.includes("Demo!23456"), "seed must not hard-code the demo password");
});

test("no hard-coded demo password in app source", () => {
  for (const file of ["prisma/seed.ts", "src/lib/auth.ts", "src/app/(auth)/login/page.tsx"]) {
    if (!existsSync(file)) continue;
    const body = readFileSync(file, "utf8");
    assert.ok(!body.includes("Demo!23456"), file + " must not hard-code the demo password");
  }
});

test("health and tasks APIs exist and tasks are authenticated", () => {
  assert.ok(existsSync("src/app/api/health/route.ts"));
  assert.ok(existsSync("src/app/api/tasks/route.ts"));
  assert.ok(existsSync("src/app/api/tasks/[id]/route.ts"));
  const route = readFileSync("src/app/api/tasks/route.ts", "utf8");
  const idRoute = readFileSync("src/app/api/tasks/[id]/route.ts", "utf8");
  assert.ok(route.includes("requireUser"), "tasks route must use requireUser");
  assert.ok(idRoute.includes("requireUser"), "tasks [id] route must use requireUser");
});

test("StaffTask model and enums exist in schema", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  assert.ok(schema.includes("model StaffTask"), "schema must define StaffTask");
  assert.ok(schema.includes("enum TaskStatus"), "schema must define TaskStatus");
  assert.ok(schema.includes("enum TaskPriority"), "schema must define TaskPriority");
});
