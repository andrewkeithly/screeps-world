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
  const sources = spawn1.room.find(FIND_SOURCES);
  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === "harvester");

  // Spawn a creep
  if (spawn1.spawning) {
    const spawningCreep = Game.creeps[spawn1.spawning.name];
    spawn1.room.visual.text("🛠️" + spawningCreep.memory.role, spawn1.pos.x + 1, spawn1.pos.y, {
      align: "left",
      opacity: 0.8
    });
  } else {
    console.log(`Harvesters: ${harvesters.length}`);

    if (harvesters.length < 10) {
      const newName = `Harvester ${harvesters.length}`;
      console.log("Spawning new harvester: " + newName);
      spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "harvester", room: room.name, working: true }
      });
    }
  }

  // Set creeps to work
  harvesters.forEach(harvester => {
    console.log(
      `${
        harvester.name
      } is carrying ${harvester.store.getUsedCapacity()} and has ${harvester.store.getFreeCapacity()} free capacity`
    );
    if (harvester.store.getFreeCapacity() !== 0) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`${harvester.name} move to ${sources[0]} and harvest`);
      // check if harvester is near source
      if (!harvester.pos.isNearTo(sources[0])) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`${harvester.name} is moving to ${sources[0]}`);
        harvester.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      } else {
        // set harvester to harvest
        harvester.harvest(sources[0]);
      }
    }
    if (harvester.store.getFreeCapacity() === 0) {
      harvester.moveTo(spawn1, { visualizePathStyle: { stroke: "#ffaa00" } });
      harvester.transfer(spawn1, RESOURCE_ENERGY);
    }
  });
});
