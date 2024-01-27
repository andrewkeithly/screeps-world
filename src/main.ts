import { Actions, build, harvest, spawn, upgrade } from "actions";
import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnTemplate } from "actions/spawn";

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
    action: Actions;
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
    [Actions.Build]: {
      action: Actions.Build,
      priority: 3,
      total: 6,
      body: [WORK, CARRY, MOVE]
    },
    [Actions.Upgrade]: {
      action: Actions.Upgrade,
      priority: 2,
      total: 2,
      body: [WORK, CARRY, MOVE]
    },
    [Actions.Harvest]: {
      action: Actions.Harvest,
      priority: 1,
      total: 2,
      body: [WORK, CARRY, MOVE]
    }
  };
  spawn(spawns, spawnTemplate);

  for (const name in Game.creeps) {
    const creep: Creep = Game.creeps[name];
    // check if creep is harvester or upgrader
    if (creep.memory.action === Actions.Harvest) {
      harvest(creep);
    }
    if (creep.memory.action === Actions.Upgrade) {
      upgrade(creep);
    }
    if (creep.memory.action === Actions.Build) {
      build(creep);
    }
  }
});
