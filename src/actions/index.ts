export { default as build } from "./build";
export { default as harvest } from "./harvest";
export { default as spawn } from "./spawn";
export { default as upgrade } from "./upgrade";

export enum Actions {
  Build = "build",
  Upgrade = "upgrade",
  Harvest = "harvest"
}

export type ActionCounts = {
  [action in Actions]?: number;
};

export const BodyComposition = {
  [Actions.Build]: [WORK, CARRY, MOVE],
  [Actions.Upgrade]: [WORK, CARRY, MOVE],
  [Actions.Harvest]: [WORK, CARRY, MOVE]
};

export function getActionCounts(creeps: { [creepName: string]: Creep }): ActionCounts {
  const actionCounts: ActionCounts = {};

  for (const creepName in creeps) {
    const creep = creeps[creepName];
    const action: Actions = creep.memory.action;

    actionCounts[action] = (actionCounts[action] ?? 0) + 1;
  }

  return actionCounts;
}
