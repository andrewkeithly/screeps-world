import { builder, harvester, upgrader } from "roles";
import { ErrorMapper } from "utils/ErrorMapper";

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
    role: string;
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

  // constants
  const spawn1 = Game.spawns.Spawn1;
  const room = spawn1.room;

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  console.log(`Room energy available: ${room.energyAvailable}`);
  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === harvester.role);
  const upgraders = _.filter(Game.creeps, creep => creep.memory.role === upgrader.role);
  const builders = _.filter(Game.creeps, creep => creep.memory.role === builder.role);

  // Spawn a creep
  if (spawn1.spawning) {
    const spawningCreep = Game.creeps[spawn1.spawning.name];
    spawn1.room.visual.text("🛠️" + spawningCreep.memory.role, spawn1.pos.x + 1, spawn1.pos.y, {
      align: "left",
      opacity: 0.8
    });
  } else if (room.energyAvailable >= 200) {
    if (builders.length < 1) {
      const newName = `Builders ${builders.length}`;
      console.log("Spawning new builder: " + newName);
      const spawnStatus = spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "builder", room: room.name, working: false }
      });
      console.log(`Builders spawn status: ${spawnStatus}`);
    }
    if (upgraders.length < 3) {
      const newName = `Upgrader ${upgraders.length}`;
      console.log("Spawning new upgrader: " + newName);
      const spawnStatus = spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "upgrader", room: room.name, working: false }
      });
      console.log(`Upgraders spawn status: ${spawnStatus}`);
    }

    if (harvesters.length < 1) {
      const newName = `Harvester ${harvesters.length}`;
      console.log("Spawning new harvester: " + newName);

      const spawnStatus = spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "harvester", room: room.name, working: false }
      });
      console.log(`Harvester spawn status: ${spawnStatus}`);
    }
  }

  for (const name in Game.creeps) {
    const creep: Creep = Game.creeps[name];
    // check if creep is harvester or upgrader
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
    if (creep.memory.role === "upgrader") {
      upgrader.run(creep);
    }
    if (creep.memory.role === "builder") {
      builder.run(creep);
    }
  }
});
