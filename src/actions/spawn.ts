import { ActionCounts, Actions, getActionCounts } from ".";
/**
 * Spawn action creates creeps based on a template
 */

export type SpawnTemplate = {
  [action in Actions]: {
    action: Actions;
    priority: number;
    total: number;
    body: BodyPartConstant[];
  };
};

type ActionType = SpawnTemplate[Actions];

// create type for an array of SpawnTemplate objects

function getSpawnOrder(spawnTemplate: SpawnTemplate, actionCounts: ActionCounts): ActionType[] {
  const orderedSpawnData: ActionType[] = [];
  for (const action in spawnTemplate) {
    const { priority, total } = spawnTemplate[action as Actions];
    const amountRemaining = total - (actionCounts[action as Actions] ?? 0);

    if (amountRemaining > 0) {
      const index = orderedSpawnData.findIndex(item => item.priority > priority);
      if (index !== -1) {
        orderedSpawnData.splice(index, 0, spawnTemplate[action as Actions]);
      } else {
        orderedSpawnData.push(spawnTemplate[action as Actions]);
      }
    }
  }
  return orderedSpawnData;
}

export default function spawn(spawns: StructureSpawn[], spawnTemplate: SpawnTemplate): void {
  // find spawns that are not spawning, have enough energy, and spawn a creep
  const availableSpawns: StructureSpawn[] = spawns.filter(s => !s.spawning && s.room.energyAvailable >= 200);
  let spawnsIndex: number = availableSpawns.length;
  console.log(`Spawns available: ${spawnsIndex}`);

  // if there are no spawns, return
  if (!availableSpawns || spawnsIndex <= 0) return;

  // grab number of creeps by action
  const creepActionCounts = getActionCounts(Game.creeps);

  // get spawn order
  const spawnOrder = getSpawnOrder(spawnTemplate, creepActionCounts);

  // spawn creeps
  for (const action of spawnOrder) {
    if (spawnsIndex <= 0) break;
    const spawnName = availableSpawns[spawnsIndex - 1].name;
    console.log(`Spawning ${action.action}-${Game.time} at ${spawnName}`);
    const spawnStatus = Game.spawns[spawnName].spawnCreep(action.body, `${action.action}-${Game.time}`, {
      memory: { action: action.action, room: availableSpawns[spawnsIndex - 1].room.name, working: false }
    });
    if (spawnStatus === 0) {
      spawnsIndex--;
    }
  }
}
