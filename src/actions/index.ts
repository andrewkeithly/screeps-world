import build from "./build";
import harvest from "./harvest";
import upgrade from "./upgrade";
export { default as spawn } from "./spawn";

const actions = {
  build,
  harvest,
  upgrade
};

export default actions;

export enum ActionTypes {
  Build = "build",
  Upgrade = "upgrade",
  Harvest = "harvest"
}

export type ActionCounts = {
  [action in ActionTypes]?: number;
};

export const BodyComposition = {
  [ActionTypes.Build]: [WORK, CARRY, MOVE],
  [ActionTypes.Upgrade]: [WORK, CARRY, MOVE],
  [ActionTypes.Harvest]: [WORK, CARRY, MOVE]
};

export function getActionCounts(creeps: { [creepName: string]: Creep }): ActionCounts {
  const actionCounts: ActionCounts = {};

  for (const creepName in creeps) {
    const creep = creeps[creepName];
    const action: ActionTypes = creep.memory.action;

    actionCounts[action] = (actionCounts[action] ?? 0) + 1;
  }

  return actionCounts;
}
