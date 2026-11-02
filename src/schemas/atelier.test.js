import { describe, it, expect } from 'vitest';
import {
  INITIAL_PROJECTS,
  INITIAL_FFE_ITEMS,
  INITIAL_SNAGS,
  INITIAL_INVOICES,
  INITIAL_CLIENTS,
  TEAM_MEMBERS,
  MATERIAL_PALETTES,
} from '../data/mockData';
import { Project, FfeItem, Snag, Invoice, Client, TeamMember, MaterialPalette } from './atelier';

/**
 * Contract test: every seed record must satisfy its canonical schema. This is
 * the executable definition of the entity shape (docs/PLAN.md §L5).
 * @param {import('zod').ZodTypeAny} schema
 * @param {unknown[]} rows
 */
function expectAllValid(schema, rows) {
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    const result = schema.safeParse(row);
    if (!result.success) {
      const label = row?.id ?? row?.name ?? JSON.stringify(row);
      throw new Error(`${label} failed schema: ${result.error.message}`);
    }
  }
}

describe('canonical schemas match the seed data', () => {
  it('Projects', () => expectAllValid(Project, INITIAL_PROJECTS));
  it('FF&E items', () => expectAllValid(FfeItem, INITIAL_FFE_ITEMS));
  it('Snags', () => expectAllValid(Snag, INITIAL_SNAGS));
  it('Invoices', () => expectAllValid(Invoice, INITIAL_INVOICES));
  it('Clients', () => expectAllValid(Client, INITIAL_CLIENTS));
  it('Team members', () => expectAllValid(TeamMember, TEAM_MEMBERS));
  it('Material palettes', () => expectAllValid(MaterialPalette, MATERIAL_PALETTES));
});
