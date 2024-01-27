/**
 * Upgrader role is a creep that will harvest energy from a source and then upgrade the controller in the room.
 */

interface Upgrader {
  run: (creep: Creep) => void;
}

const upgrader: Upgrader = {
  run(creep: Creep): void {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.working) {
      if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller as StructureController, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

export default upgrader;
