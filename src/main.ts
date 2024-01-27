import { Role, builder, harvester, upgrader } from "roles";
import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnTemplate } from "actions/spawner";
import { spawner } from "actions";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definition alone.
          You must also give them an implementation if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: Role;
    room: string;
    working: boolean;
  }

  // Syntax for adding properties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // spawn creeps
  const spawns = Game.rooms.sim.find(FIND_MY_SPAWNS);
  const spawnTemplate: SpawnTemplate = {
    [Role.Builder]: {
      role: Role.Builder,
      priority: 3,
      total: 6,
      body: [WORK, CARRY, MOVE]
    },
    [Role.Upgrader]: {
      role: Role.Upgrader,
      priority: 2,
      total: 2,
      body: [WORK, CARRY, MOVE]
    },
    [Role.Harvester]: {
      role: Role.Harvester,
      priority: 1,
      total: 2,
      body: [WORK, CARRY, MOVE]
    }
  };
  spawner.run(spawns, spawnTemplate);

  for (const name in Game.creeps) {
    const creep: Creep = Game.creeps[name];
    // check if creep is harvester or upgrader
    if (creep.memory.role === Role.Harvester) {
      harvester.run(creep);
    }
    if (creep.memory.role === Role.Upgrader) {
      upgrader.run(creep);
    }
    if (creep.memory.role === Role.Builder) {
      builder.run(creep);
    }
  }
});
