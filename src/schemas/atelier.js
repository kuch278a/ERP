/**
 * Canonical schemas for atelier entities (docs/PLAN.md §L1).
 * These are the single source of truth for entity shape on the client and are
 * shared by forms, the API client, and contract tests. Unknown fields are kept
 * (`.passthrough()`) so server additions don't break the client.
 */
import { z } from 'zod';

const DocId = z.string().min(1);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
const Money = z.number().nonnegative();

export const ProjectPhase = z.object({
  name: z.string().min(1),
  status: z.string().min(1),
  date: z.string().min(1),
});

export const Project = z
  .object({
    id: DocId,
    name: z.string().min(1),
    type: z.string(),
    location: z.string(),
    area: z.string(),
    client: z.string(),
    clientId: z.string(),
    totalBudget: Money,
    designFee: Money,
    invoicedAmount: Money,
    stage: z.string(),
    progress: z.number().min(0).max(100),
    leadArchitect: z.string(),
    leadId: z.string(),
    startDate: IsoDate,
    targetHandover: IsoDate,
    image: z.string(),
    health: z.string(),
    aesthetic: z.string(),
    description: z.string(),
    phases: z.array(ProjectPhase),
    roomSchedule: z.array(z.string()),
  })
  .passthrough();

export const FfeItem = z
  .object({
    id: DocId,
    specCode: z.string(),
    name: z.string().min(1),
    category: z.string(),
    room: z.string(),
    projectId: z.string(),
    projectName: z.string(),
    vendor: z.string(),
    finish: z.string(),
    dimensions: z.string(),
    leadTime: z.string(),
    unitCost: Money,
    markupPct: z.number(),
    clientPrice: Money,
    qty: z.number().int().positive(),
    sampleApproved: z.boolean(),
    poStatus: z.string(),
    notes: z.string(),
  })
  .passthrough();

export const Snag = z
  .object({
    id: DocId,
    projectId: z.string(),
    projectName: z.string(),
    location: z.string(),
    description: z.string().min(1),
    category: z.string(),
    severity: z.string(),
    contractor: z.string(),
    loggedBy: z.string(),
    dateLogged: IsoDate,
    dueDate: IsoDate,
    status: z.string(),
    photoUrl: z.string(),
    rectificationPlan: z.string(),
  })
  .passthrough();

export const Invoice = z
  .object({
    id: DocId,
    projectId: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    milestone: z.string(),
    amount: Money,
    issueDate: IsoDate,
    dueDate: IsoDate,
    status: z.string(),
    taxRate: z.number().nonnegative(),
    totalWithTax: Money,
    paymentMethod: z.string(),
  })
  .passthrough();

export const Client = z
  .object({
    id: DocId,
    name: z.string().min(1),
    type: z.string(),
    email: z.string().email(),
    phone: z.string(),
    city: z.string(),
    stylePreference: z.string(),
    activeProjects: z.array(z.string()),
    lifetimeValue: Money,
    status: z.string(),
    notes: z.string(),
  })
  .passthrough();

export const TeamMember = z
  .object({
    id: DocId,
    name: z.string().min(1),
    role: z.string(),
    initials: z.string(),
    specialty: z.string(),
    assignedProjects: z.number().int().nonnegative(),
    activeTasks: z.number().int().nonnegative(),
    capacityPct: z.number().min(0).max(100),
    email: z.string().email(),
  })
  .passthrough();

export const MaterialPalette = z
  .object({
    name: z.string().min(1),
    category: z.string(),
    tone: z.string(),
    origin: z.string(),
    application: z.string(),
    description: z.string(),
  })
  .passthrough();
