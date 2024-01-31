function isAlbionId(id) {
  return /[\w-]{22}/.test(id);
}

function isTrackEntity(entity) {
  return (
    entity && typeof entity.id === "string" && typeof entity.name === "string" && typeof entity.server === "string"
  );
}

function toTrackEntity(entity, server) {
  if (!entity) return entity;

  if (entity.Id && entity.Name) {
    return {
      id: entity.Id,
      name: entity.Name,
      server,
    };
  }

  if (entity.AllianceId && entity.AllianceTag) {
    return {
      id: entity.AllianceId,
      name: entity.AllianceTag,
      server,
    };
  }

  return entity;
}

// Get all victim items, including equipment and inventory, excluding nulls
function getVictimItems(event) {
  const { Equipment, Inventory } = event.Victim;
  return {
    equipment: [
      Equipment.Armor,
      Equipment.Bag,
      Equipment.Cape,
      Equipment.Food,
      Equipment.Head,
      Equipment.MainHand,
      Equipment.Mount,
      Equipment.OffHand,
      Equipment.Potion,
      Equipment.Shoes,
    ].filter((item) => !!item),
    inventory: Inventory.filter((item) => !!item),
  };
}

const transformEventPlayer = (player) => ({
  id: player.Id,
  name: player.Name,
  ip: player.AverageItemPower,
  killFame: player.KillFame,
  deathFame: player.DeathFame,
  guild: player.GuildId
    ? {
        id: player.GuildId,
        name: player.GuildName,
      }
    : null,
  alliance: player.AllianceId
    ? {
        id: player.AllianceId,
        tag: player.AllianceTag,
        name: player.AllianceName,
      }
    : null,
  equipment: player.Equipment,
});

const transformEvent = (event) => ({
  id: event.EventId,
  server: event.server,
  battle: event.BattleId,
  timestamp: event.TimeStamp,
  fame: event.TotalVictimKillFame,
  killer: transformEventPlayer(event.Killer),
  victim: transformEventPlayer(event.Victim),
  participants: event.Participants.map(transformEventPlayer),
});

const hasAwakening = (event) => {
  return event.Killer?.Equipment?.MainHand?.LegendarySoul || event.Victim?.Equipment?.MainHand?.LegendarySoul;
};

const transformTrait = (trait) => {
  const TRAIT_UNIT = {
    TRAIT_ABILITY_DAMAGE: "%",
    TRAIT_ATTACK_RANGE: "%",
    TRAIT_ATTACK_SPEED: "%",
    TRAIT_AUTO_ATTACK_DAMAGE: "%",
    TRAIT_CAST_SPEED_INCREASE: "%",
    TRAIT_CC_DURATION: "%",
    TRAIT_COOLDOWN_REDUCTION: "%",
    TRAIT_DEFENSE_BONUS: "%",
    TRAIT_ENERGY_COST_REDUCTION: "%",
    TRAIT_HEALING_DEALT: "?",
    TRAIT_HEALING_RECEIVED: "%",
    TRAIT_LIFESTEAL: "%",
    TRAIT_MOB_FAME: "%",
    TRAIT_RESILIENCE_PENETRATION: "%",
    TRAIT_THREAT_BONUS: "%",
  };

  const TRAIT_TYPES = {
    TRAIT_ABILITY_DAMAGE: "Ability Damage",
    TRAIT_ATTACK_RANGE: "Attack Range",
    TRAIT_ATTACK_SPEED: "Attack Speed",
    TRAIT_AUTO_ATTACK_DAMAGE: "Auto-Attack Damage",
    TRAIT_CAST_SPEED_INCREASE: "Cast Time Reduction",
    TRAIT_CC_DURATION: "Crowd Control Duration",
    TRAIT_CC_RESIST: "Crowd Control Resistance",
    TRAIT_COOLDOWN_REDUCTION: "Cooldown Rate",
    TRAIT_DEFENSE_BONUS: "Defense vs. All",
    TRAIT_ENERGY_COST_REDUCTION: "Energy Cost Reduction",
    TRAIT_ENERGY_MAX: "Max Energy",
    TRAIT_HEALING_DEALT: "Healing",
    TRAIT_HEALING_RECEIVED: "Healing Received",
    TRAIT_HITPOINTS_MAX: "Max Health",
    TRAIT_ITEM_POWER: "Item Power",
    TRAIT_LIFESTEAL: "Life Steal",
    TRAIT_MOB_FAME: "Mob Fame",
    TRAIT_RESILIENCE_PENETRATION: "Resilience Penetration",
    TRAIT_THREAT_BONUS: "Threat Generation",
  };

  return {
    name: TRAIT_TYPES[trait.trait] || trait.trait,
    type: trait.trait,
    value: (trait.value * (TRAIT_UNIT[trait.trait] === "%" ? 100 : 1)).toFixed(2),
    relativeValue: (trait.value / trait.maxvalue).toFixed(2),
    unit: TRAIT_UNIT[trait.trait] || "",
  };
};

module.exports = {
  getVictimItems,
  hasAwakening,
  isAlbionId,
  isTrackEntity,
  toTrackEntity,
  transformEvent,
  transformTrait,
};
