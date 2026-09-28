export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-workforce-transformation-planner",
  title: "Workforce Transformation Planner",
  tagline: "Map roles into automate, AI-assisted, and human-only",
  accent: "blue",
};

export const pages: PageConfig[] = [
  {
    label: "Roles & Tasks",
    href: "/roles",
    description: "Role inventory and task classification.",
    entities: ["JobRole", "TaskInventory", "Employee"],
    workflows: ["task-classify"],
  },
  {
    label: "Automation",
    href: "/automation",
    description: "Assessments and displacement forecasts.",
    entities: ["AutomationAssessment", "DisplacementForecast", "Scenario"],
    workflows: ["exposure-forecast"],
  },
  {
    label: "Reskilling",
    href: "/reskilling",
    description: "Skill gaps, plans, transitions, resources.",
    entities: ["SkillGap", "ReskillingPlan", "TransitionPath", "LearningResource"],
    workflows: ["plan-generate"],
  },
  {
    label: "Governance",
    href: "/governance",
    description: "Targets and governance actions.",
    entities: ["ProductivityTarget", "GovernanceAction"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  JobRole: {
    name: "JobRole",
    label: "Role",
    fields: [{ name: "title", kind: "string" }, { name: "department", kind: "string" }, { name: "level", kind: "string" }, { name: "headcount", kind: "number" }, { name: "avgSalary", kind: "number" }, { name: "status", kind: "string" }],
  },
  TaskInventory: {
    name: "TaskInventory",
    label: "Task",
    fields: [{ name: "name", kind: "string" }, { name: "frequency", kind: "string" }, { name: "hoursPerWeek", kind: "number" }, { name: "classification", kind: "string" }, { name: "evidence", kind: "string" }, { name: "automationConfidence", kind: "number" }],
  },
  AutomationAssessment: {
    name: "AutomationAssessment",
    label: "Assessment",
    fields: [{ name: "taskRef", kind: "string" }, { name: "tooling", kind: "string" }, { name: "feasibility", kind: "string" }, { name: "estimatedSavings", kind: "number" }, { name: "risk", kind: "string" }, { name: "status", kind: "string" }],
  },
  ReskillingPlan: {
    name: "ReskillingPlan",
    label: "Reskilling Plan",
    fields: [{ name: "employeeRef", kind: "string" }, { name: "targetRole", kind: "string" }, { name: "curriculum", kind: "string" }, { name: "status", kind: "string" }, { name: "startDate", kind: "date" }, { name: "targetComplete", kind: "date" }],
  },
  TransitionPath: {
    name: "TransitionPath",
    label: "Transition Path",
    fields: [{ name: "fromRole", kind: "string" }, { name: "toRole", kind: "string" }, { name: "gapSkills", kind: "string" }, { name: "status", kind: "string" }, { name: "durationWeeks", kind: "number" }, { name: "successRate", kind: "number" }],
  },
  ProductivityTarget: {
    name: "ProductivityTarget",
    label: "Productivity Target",
    fields: [{ name: "metric", kind: "string" }, { name: "baselineValue", kind: "number" }, { name: "targetValue", kind: "number" }, { name: "period", kind: "string" }, { name: "status", kind: "string" }, { name: "sponsor", kind: "string" }],
  },
  DisplacementForecast: {
    name: "DisplacementForecast",
    label: "Displacement Forecast",
    fields: [{ name: "horizon", kind: "string" }, { name: "exposurePct", kind: "number" }, { name: "affectedFte", kind: "number" }, { name: "mitigation", kind: "string" }, { name: "status", kind: "string" }, { name: "modeledAt", kind: "date" }],
  },
  Employee: {
    name: "Employee",
    label: "Employee",
    fields: [{ name: "name", kind: "string" }, { name: "employeeId", kind: "string" }, { name: "roleTitle", kind: "string" }, { name: "manager", kind: "string" }, { name: "hiredAt", kind: "date" }, { name: "status", kind: "string" }],
  },
  SkillGap: {
    name: "SkillGap",
    label: "Skill Gap",
    fields: [{ name: "skill", kind: "string" }, { name: "currentLevel", kind: "string" }, { name: "requiredLevel", kind: "string" }, { name: "trainingRef", kind: "string" }, { name: "status", kind: "string" }, { name: "gapScore", kind: "number" }],
  },
  Scenario: {
    name: "Scenario",
    label: "Scenario",
    fields: [{ name: "name", kind: "string" }, { name: "assumptions", kind: "string" }, { name: "headcountDelta", kind: "number" }, { name: "costDelta", kind: "number" }, { name: "decision", kind: "string" }, { name: "status", kind: "string" }],
  },
  GovernanceAction: {
    name: "GovernanceAction",
    label: "Governance Action",
    fields: [{ name: "action", kind: "string" }, { name: "owner", kind: "string" }, { name: "kind", kind: "string" }, { name: "status", kind: "string" }, { name: "dueDate", kind: "date" }, { name: "notes", kind: "string" }],
  },
  LearningResource: {
    name: "LearningResource",
    label: "Learning Resource",
    fields: [{ name: "title", kind: "string" }, { name: "provider", kind: "string" }, { name: "durationHours", kind: "number" }, { name: "cost", kind: "string" }, { name: "skillTag", kind: "string" }, { name: "format", kind: "string" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "task-classify",
    title: "Draft: Task Classifier",
    description: "Classify a task: automate, AI-assisted, human-only.",
    prompt: "You are a workforce-transformation analyst. Classify the task as automate, ai-assisted, or human-only. Justify with skills required, risk, and example tooling.",
    fields: ["task", "frequency", "systemsUsed", "judgmentRequired"],
  },
  {
    slug: "exposure-forecast",
    title: "Draft: Exposure Forecaster",
    description: "Forecast role displacement exposure.",
    prompt: "Draft workforce scenarios from explicit task classifications, horizon and assumptions. Do not present a calibrated displacement probability or predict individual job loss.",
    fields: ["role", "taskMix", "headcount", "industryTrend"],
  },
  {
    slug: "plan-generate",
    title: "Draft: Reskilling Plan Generator",
    description: "Generate a reskilling plan for an employee.",
    prompt: "You are an L&D architect. Produce a reskilling plan: target role, skill gaps, curriculum sequence, milestones, readiness checkpoints.",
    fields: ["currentRole", "targetRole", "existingSkills", "timeBudgetHours"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
