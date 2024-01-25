/**
 * The Harvester interface defines the structure for a harvester object.
 * It has a run method that takes a Creep object as a parameter and returns void.
 */
interface Harvester {
  run: (creep: Creep) => void;
}

const harvester: Harvester = {
  run(creep: Creep): void {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.store.getFreeCapacity() !== 0) {
      if (!creep.pos.isNearTo(sources[0])) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      } else {
        creep.harvest(sources[0]);
      }
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.moveTo(Game.spawns.Spawn1, { visualizePathStyle: { stroke: "#ffaa00" } });
      creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY);
    }
  }
};

export default harvester;
