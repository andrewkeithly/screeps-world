/**
 * Spawn action creates creeps based on a template
 */

export enum Actions {
  Build = "build",
  Upgrade = "upgrade",
  Harvest = "harvest"
}

export enum SpawnTypes {
  small = "small",
  medium = "medium",
  large = "large"
}

export interface CreepType {
  [creepId: string]: {
    actions: Actions;
    name: string;
    type: string;
    body: BodyPartConstant[];
  };
}

export interface CreepCounts {
  [creepType: string]: number;
}

export const BodyComposition = {
  [Actions.Build]: [WORK, CARRY, MOVE],
  [Actions.Upgrade]: [WORK, CARRY, MOVE],
  [Actions.Harvest]: [WORK, CARRY, MOVE]
};

// TODO: Refactor to count creeps as as they spawn
// instead of iterating through all creeps
// every tick
export function getCreepCounts(creeps: { [creepId: string]: Creep }): CreepCounts {
  const creepCounts: CreepCounts = {};

  for (const creepId in creeps) {
    const creepType = creeps[creepId].memory.type;
    creepCounts[creepType] = (creepCounts[creepType] ?? 0) + 1;
  }
  return creepCounts;
}

export interface SpawnTemplate {
  [spawnType: string]: {
    actions: Actions[];
    priority: number;
    total: number;
    type: SpawnTypes;
    body: BodyPartConstant[];
  };
}

type SpawnType = SpawnTemplate[string];

// TODO: Refactor to use a priority queue
function getSpawnOrder(spawnTemplate: SpawnTemplate, spawnCounts: CreepCounts): SpawnType[] {
  const orderedSpawnData: SpawnType[] = [];
  for (const spawnType in spawnTemplate) {
    const { priority, total } = spawnTemplate[spawnType];
    const amountRemaining = total - (spawnCounts[spawnType] ?? 0);

    if (amountRemaining > 0) {
      const index = orderedSpawnData.findIndex(item => item.priority > priority);
      if (index !== -1) {
        orderedSpawnData.splice(index, 0, spawnTemplate[spawnType]);
      } else {
        orderedSpawnData.push(spawnTemplate[spawnType]);
      }
    }
  }
  return orderedSpawnData;
}

export default function spawn(spawns: StructureSpawn[], spawnTemplate: SpawnTemplate): void {
  // find spawns that are not spawning, have enough energy, and spawn a creep
  const availableSpawns: StructureSpawn[] = spawns.filter(s => !s.spawning && s.room.energyAvailable >= 200);
  const spawnsIndex: number = availableSpawns.length;

  // if there are no spawns, return
  if (!availableSpawns || spawnsIndex <= 0) return;

  // get number of creeps by type
  const creepCountsByType = getCreepCounts(Game.creeps);

  // get spawn order
  const spawnOrder = getSpawnOrder(spawnTemplate, creepCountsByType);

  // spawn creeps
  for (const spawnIndex of spawnOrder) {
    const spawnName = availableSpawns[spawnsIndex - 1].name;
    console.log(`Spawning ${spawnIndex.type}-${Game.time} at ${spawnName}`);
    const spawnStatus = Game.spawns[spawnName].spawnCreep(spawnIndex.body, `${spawnIndex.type}-${Game.time}`, {
      memory: {
        actions: spawnIndex.actions,
        type: spawnIndex.type,
        room: availableSpawns[spawnsIndex - 1].room.name,
        working: false
      }
    });
    if (spawnStatus === 0) {
      spawnOrder.shift();
    }
  }
}
