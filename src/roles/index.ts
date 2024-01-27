export { default as builder } from "./builder";
export { default as harvester } from "./harvester";
export { default as upgrader } from "./upgrader";

export enum Role {
  Builder = "builder",
  Upgrader = "upgrader",
  Harvester = "harvester"
}

export type RoleCounts = {
  [role in Role]?: number;
};

export const BodyComposition = {
  [Role.Builder]: [WORK, CARRY, MOVE],
  [Role.Upgrader]: [WORK, CARRY, MOVE],
  [Role.Harvester]: [WORK, CARRY, MOVE]
};

export function getRoleCounts(creeps: { [creepName: string]: Creep }): RoleCounts {
  const roleCounts: RoleCounts = {};

  for (const creepName in creeps) {
    const creep = creeps[creepName];
    const role: Role = creep.memory.role;

    roleCounts[role] = (roleCounts[role] ?? 0) + 1;
  }

  return roleCounts;
}
