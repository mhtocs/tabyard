import type { GraveyardEntry } from '../storage/schema'
import type { ActionContext, ActionHandlers, ActionResult } from './actions'

export type ActionHandlerDeps = {
  removeTab: (tabId: number) => Promise<void>
  readGraveyard: () => Promise<GraveyardEntry[]>
  writeGraveyard: (entries: GraveyardEntry[]) => Promise<void>
}

async function noopKeep(): Promise<ActionResult> {
  return { tabRemoved: false }
}

async function closeTab(
  deps: ActionHandlerDeps,
  ctx: ActionContext,
): Promise<ActionResult> {
  const entry: GraveyardEntry = {
    id: crypto.randomUUID(),
    url: ctx.tab.url,
    title: ctx.tab.title,
    favicon: ctx.tab.favicon,
    closedAt: Date.now(),
    action: 'close',
    ruleText: ctx.ruleText,
  }
  const graveyard = await deps.readGraveyard()
  await deps.writeGraveyard([...graveyard, entry])
  await deps.removeTab(ctx.tab.tabId)
  return { tabRemoved: true, graveyardEntryId: entry.id }
}

async function discardTab(
  deps: ActionHandlerDeps,
  ctx: ActionContext,
): Promise<ActionResult> {
  await deps.removeTab(ctx.tab.tabId)
  return { tabRemoved: true }
}

export function createActionHandlers(deps: ActionHandlerDeps): ActionHandlers {
  return {
    keep: noopKeep,
    close: (ctx) => closeTab(deps, ctx),
    discard: (ctx) => discardTab(deps, ctx),
  }
}

export async function executeAction(
  handlers: ActionHandlers,
  action: keyof ActionHandlers,
  ctx: ActionContext,
): Promise<ActionResult> {
  return handlers[action](ctx)
}
