import { Role, RoleCounts, getRoleCounts } from "../roles";
/**
 * Represents a Spawner module.
 * This module is responsible for spawning entities in the game.
 */

interface Spawner {
  // run takes an array of spawns, array of roles, and returns a spawn status
  run: (spawns: StructureSpawn[], spawnTemplate: SpawnTemplate) => void;
}

export type SpawnTemplate = {
  [role in Role]: {
    role: Role;
    priority: number;
    total: number;
    body: BodyPartConstant[];
  };
};

type RoleType = SpawnTemplate[Role];

// create type for an array of SpawnTemplate objects

function getSpawnOrder(spawnTemplate: SpawnTemplate, roleCounts: RoleCounts): RoleType[] {
  const orderedSpawnData: RoleType[] = [];
  for (const role in spawnTemplate) {
    const { priority, total } = spawnTemplate[role as Role];
    const amountRemaining = total - (roleCounts[role as Role] ?? 0);

    if (amountRemaining > 0) {
      const index = orderedSpawnData.findIndex(item => item.priority > priority);
      if (index !== -1) {
        orderedSpawnData.splice(index, 0, spawnTemplate[role as Role]);
      } else {
        orderedSpawnData.push(spawnTemplate[role as Role]);
      }
    }
  }
  return orderedSpawnData;
}

const spawner: Spawner = {
  run(spawns: StructureSpawn[], spawnTemplate: SpawnTemplate): void {
    // find spawns that are not spawning, have enough energy, and spawn a creep
    const availableSpawns: StructureSpawn[] = spawns.filter(s => !s.spawning && s.room.energyAvailable >= 200);
    let spawnsIndex: number = availableSpawns.length;
    console.log(`Spawns available: ${spawnsIndex}`);

    // if there are no spawns, return
    if (!availableSpawns || spawnsIndex <= 0) return;

    // grab number of creeps by role
    const creepRoleCounts = getRoleCounts(Game.creeps);

    // get spawn order
    const spawnOrder = getSpawnOrder(spawnTemplate, creepRoleCounts);

    // spawn creeps
    for (const role of spawnOrder) {
      if (spawnsIndex <= 0) break;
      const spawnName = availableSpawns[spawnsIndex - 1].name;
      console.log(`Spawning ${role.role}-${Game.time} at ${spawnName}`);
      const spawnStatus = Game.spawns[spawnName].spawnCreep(role.body, `${role.role}-${Game.time}`, {
        memory: { role: role.role, room: availableSpawns[spawnsIndex - 1].room.name, working: false }
      });
      if (spawnStatus === 0) {
        spawnsIndex--;
      }
    }
  }
};

export default spawner;
