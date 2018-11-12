function findSources(room) {
    return room.find(FIND_SOURCES, {
        filter: (source) => {
            return (source.energy > 0);
        }
    });
}

Room.prototype._sourceIdWithFewestHarvesters = function() {
    var sources = findSources(this);
    if(!sources
        || sources.length == 0) {
        return null;
    }

    if(sources.length == 1) {
        return sources[0].id;
    }

    var sourceIdWithFewestHarvesters = 0;
    var fewestNumberOfHarvestersFound = 99999;

    for(var s = 0; s < sources.length; ++s) {
        var numberOfCreepsHarvestingSource = 0;
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.room.name != this.name) {
                continue;
            }

            if(creep.memory.sourceToHarvest
                && creep.memory.sourceToHarvest == sources[s].id){
                ++numberOfCreepsHarvestingSource;
            }
        }

        if(numberOfCreepsHarvestingSource < fewestNumberOfHarvestersFound) {
            fewestNumberOfHarvestersFound = numberOfCreepsHarvestingSource;
            sourceIdWithFewestHarvesters = s;
        }
    }

    return sources[sourceIdWithFewestHarvesters].id;
};

Room.prototype._aSpawnOrExtensionRequiresEnergy = function() {
    var structures = this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION
            || structure.structureType == STRUCTURE_SPAWN)
            && structure.energy < structure.energyCapacity;
        }
    });

    return structures != null
        && structures.length > 0;

};

Room.prototype._storageRequiresEnergy = function () {
    if (this._hasStorage)
        if (this._storageFull)
            return true;

    return false;
}

Room.prototype._closestSpawnOrExtensionThatRequiresEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION
                || structure.structureType == STRUCTURE_SPAWN)
                && structure.energy < structure.energyCapacity;
        }
    });

    return target;
};

Room.prototype._aTowerRequiresEnergy = function() {
    var structures = this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER
                && structure.energy < (structure.energyCapacity - 200);
        }
    });

    return structures != null
        && structures.length > 0;
};

Room.prototype._closestTowerThatRequiresEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER
                && structure.energy < structure.energyCapacity - 200;
        }
    });

    return target;
};

Room.prototype._roomHasConstructionSites = function() {
    var structures = this.find(FIND_CONSTRUCTION_SITES);
    return structures != null
        && structures.length > 0;
};

Room.prototype._closestConstructionSite = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    return target;
};

Room.prototype._roomHasRepairSites = function() {
    var towers = this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });

    if(towers && towers.length > 0) {
        return false;
    }

    var structures = this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_ROAD
                && structure.hits < structure.hitsMax;
        }
    });

    return structures != null
        && structures.length > 0;
};

Room.prototype._closestRepairSite = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_ROAD
                && structure.hits < structure.hitsMax;
        }
    });

    return target;
};

Room.prototype._storageHasEnergy = function() {
    if(this.storage && this.storage.store[RESOURCE_ENERGY] > 0) {
        return true;
    }

    return false;
};

Room.prototype._hasStorage = function() {
    var storageStructure = this.storage;
    return storageStructure != null;
};

Room.prototype._storageFull = function () {
    var total = _.sum(this.room.storage.store);
    console.log("resources: " + total + " / " + this.room.storage.storeCapacity);
    return this.room.storage.storeCapacity >= total;
};