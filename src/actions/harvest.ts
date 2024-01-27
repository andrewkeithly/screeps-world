/**
 * Harvest sets creeps to harvest energy until full, then supply spawn
 */

export default function harvest(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
    creep.say("📦 supply");
  }

  if (creep.memory.working) {
    if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
