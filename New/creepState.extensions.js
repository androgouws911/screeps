Creep.prototype._isEmpty = function () {
    return this.carry.energy == 0;
};

Creep.prototype._isFull = function () {
    return this.carry.energy == this.carryCapacity;
};

Creep.prototype._storageFull = function() {
    var total = _.sum(this.room.storage.store);
    return this.room.storage.storeCapacity > total;
}

Creep.prototype._timeLow = function () {
    return this.ticksToLive < 50;
};

Creep.prototype._timeRestored = function () {
    return this.ticksToLive > 1400;
};

Creep.prototype._recycleIsValid = function () {
    return this.ticksToLive < 25;
}

Creep.prototype._recycle = function (spawnConstant, flagConstant) {
    var spawn = Game.spawns[spawnConstant];
    var flagObject = Game.flags[flagConstant];
    if (spawn.recycleCreep(this) == ERR_NOT_IN_RANGE) {
        this.moveTo(flagObject);
    }
    else {
        console.log('Creep recycle: ' + this.name);
    }
}

Creep.prototype._renew = function (spawnConstant) {
    var spawn = Game.spawns[spawnConstant];
    if (spawn.renewCreep(this) == ERR_NOT_IN_RANGE)
        this.moveTo(spawn);
};

Creep.prototype._renewIsValid = function () {
    if (this.memory.renewingCreep == true) {
        if (this._timeLow()) {
            this.say('renew: ' + this.ticksToLive);
            return true;
        }

        if (!this._timeRestored()) {
            this.say('renew: ' + this.ticksToLive);
            return true;
        }
        else {
            console.log(this.name + ' renewed to ' + this.ticksToLive);
            this.memory.renewingCreep = false;
            return false;
        }
    }
    else
        this.memory.renewingCreep = false;
    return false;
};

Creep.prototype._upgrade = function () {
    if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
    }
};

Creep.prototype._upgradeIsValid = function () {
    return !this._isEmpty();
};

Creep.prototype._harvest = function () {
    if (!this.memory.sourceToHarvest) {
        this.memory.sourceToHarvest = this.room._sourceIdWithFewestHarvesters();
    }

    if (!this.memory.sourceToHarvest && this.room._storageHasEnergy()) {
        if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.storage);
        }

        return;
    }

    var currentSource = Game.getObjectById(this.memory.sourceToHarvest);
    if (!currentSource) {
        //console.log('ERROR, NO SOURCE FOR CREEP TO HARVEST: ' + this.name);
        return;
    }

    if (currentSource.energy <= 0) {
        this.memory.sourceToHarvest = this.room._sourceIdWithFewestHarvesters();
        currentSource = Game.getObjectById(this.memory.sourceToHarvest);
    }

    if (this.harvest(currentSource) == ERR_NOT_IN_RANGE) {
        this.moveTo(currentSource);
    }
};

Creep.prototype._harvestIsValid = function () {
    var roomHasStorageWithEnergy = this.room._storageHasEnergy();
    var roomHasSourceWithEnergy = this.room._sourceIdWithFewestHarvesters();
    var isNotFull = !this._isFull();
    return isNotFull && (roomHasSourceWithEnergy || roomHasStorageWithEnergy);

};

Creep.prototype._loadEnergy = function () {
    var target = this.room._closestSpawnOrExtensionThatRequiresEnergy(this);
    if (!target) {
        //console.log('ERROR, NO STRUCTURE FOR CREEP TO LOAD: ' + this.name);
        return;
    }

    if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
};

Creep.prototype._loadEnergyIsValid = function () {
    return !this._isEmpty()
        && this.room._aSpawnOrExtensionRequiresEnergy();
};

Creep.prototype._loadTower = function () {
    if (!this.memory.towerToLoad) {
        //TODO prefer a tower without a tower loader, if there are multiple towers to load
        var closestTower = this.room._closestTowerThatRequiresEnergy(this);
        if (closestTower) {
            this.memory.towerToLoad = closestTower.id;
        }
    }

    var tower = Game.getObjectById(this.memory.towerToLoad);
    if (!tower) {
        //console.log('ERROR, NO TOWER FOR CREEP TO LOAD: ' + this.name);
        return;
    }

    if (this.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(tower);
    }
};

Creep.prototype._loadTowerIsValid = function () {
    var tower = Game.getObjectById(this.memory.towerToLoad);
    if (!tower || tower.energy >= tower.energyCapacity - 50) {
        return false;
    }

    return !this._isEmpty();
};

Creep.prototype._build = function () {
    var target = this.room._closestConstructionSite(this);
    if (!target) {
        //console.log('ERROR, NO CONSTRUCTION SITE FOR CREEP TO BUILD: ' + this.name);
        return;
    }

    if (this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
};

Creep.prototype._buildIsValid = function () {
    return !this._isEmpty()
        && this.room._roomHasConstructionSites();
};

Creep.prototype._repair = function () {
    var target = this.room._closestRepairSite(this);
    if (!target) {
        //console.log('ERROR, NO REPAIR SITE FOR CREEP TO REPAIR: ' + this.name);
        return;
    }

    var repairResult = this.repair(target);
    if (repairResult == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
};

Creep.prototype._repairIsValid = function () {
    return !this._isEmpty()
        && (this.room._roomHasRepairSites());
};

Creep.prototype._moveFlag = function () {
    var flag = this.memory.targetFlag;
    if (!flag) {
        //console.log('ERROR, NO REPAIR FLAG FOR CREEP TO MOVE TO: ' + this.name);
        return;
    }

    var flagObject = Game.flags[flag];
    this.moveTo(flagObject);
};

Creep.prototype._moveFlagIsValid = function () {
    var flag = this.memory.targetFlag;
    if (!flag) {
        return false;
    }

    var flagObject = Game.flags[flag];
    return !this.pos.isNearTo(flagObject.pos);
};

Creep.prototype._loadContainer = function () {
    var target = this.room.storage;
    if (!target) {
        //console.log('ERROR, NO CONTAINER FOR CREEP TO LOAD: ' + this.name);
        return;
    }

    if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
};

Creep.prototype._loadContainerIsValid = function () {
    return !this._isEmpty() && this.room._hasStorage() && this._storageFull();
};

