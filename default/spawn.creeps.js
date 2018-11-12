var creepConstants = require('creep.constants');
var roomConstants = require('room.constants');
var flags = require('flags');

var numberOfCreepsInRoom = function (roomName, creepRole) {
    var creepCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == creepRole
            && creep.room.name == roomName);

    return creepCount.length;
};

var numberOfCreepsAssignedToHarvestRoomFlag = function(harvestRoomFlag) {
    var creeps = Game.creeps;
    var counter = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.harvestRoomFlag
            && creep.memory.harvestRoomFlag == harvestRoomFlag) {
            ++counter;
        }
    }

    return counter;
};

var spawnLongHauler = function (spawnConstant, harvestRoomflag) {

    var body = [];
    var ROOM = roomConstants.ROOM_PRIMARY;
    var energy = Game.rooms[ROOM].energyCapacityAvailable;
    var haulerNeeded = true;

    if (energy >= 200 && energy < 400)
        haulerNeeded = false;
    else if (energy >= 400 && energy < 600)
        haulerNeeded = false;
    else if (energy >= 600 && energy < 800)
        body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    else if (energy >= 800 && energy < 1000)
        body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    else if (energy >= 800 && energy < 1000)
        body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    else if (energy >= 1000)
        body = [WORK, WORK, ATTACK, ATTACK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    

    var newName = Game.spawns[spawnConstant].createCreep(body, undefined, {role: creepConstants.ROLE_LONG_HAUL});
        
    var newCreep = Game.creeps[newName];
    if(!newCreep) {
        return;
    }
    
    newCreep.memory.harvestRoomFlag = harvestRoomflag;
    console.log('Spawning new long hauler: ' + newName + ' - Energy: ' + energy);

    return newName;
};

var spawnCreeps = {

    /** @param {Creep} creep **/
    run: function (creepRole, numberOfCreeps, spawnConstant) {
        var body = [];
        var ROOM = roomConstants.ROOM_PRIMARY;
        var energy = Game.rooms[ROOM].energyCapacityAvailable;
        var current = Game.rooms[ROOM].energyAvailable;

        var energyDiv200 = Math.floor(energy / 200);

        if (energyDiv200 > 7)
            energyDiv200 = 7;
        
        for (var i = 0; i < energyDiv200; ++i)
        {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        };

        //if (energy >= 200 && energy < 400)
        //    body = [WORK, CARRY, MOVE];
        //else if (energy >= 400 && energy < 600)
        //    body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        //else if (energy >= 600 && energy < 800)
        //    body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        //else if (energy >= 800 && energy < 1000)
        //    body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        //else if (energy >= 1000 && energy < 1200)
        //    body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        //else if (energy >= 1200)
        //    body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        
        var creepCount = numberOfCreepsInRoom(roomConstants.ROOM_PRIMARY, creepRole);

        if(creepCount < numberOfCreeps) {
            var newName = Game.spawns[spawnConstant].createCreep(body, undefined, { role: creepRole });

            if (!newName || newName == -6 || newName == -4) {
                return;
            }

            console.log('Spawning new ' + creepRole + ': ' + newName + ' - Energy: ' + energy);
        }
	},
    spawnLongHaulers: function(spawnConstant) {
        for(var i = 0; i < flags.HARVEST_ROOM_FLAGS.length; ++i) {
            var harvestRoomflag = flags.HARVEST_ROOM_FLAGS[i];
            var creepsForHarvest = numberOfCreepsAssignedToHarvestRoomFlag(harvestRoomflag);

            if(creepsForHarvest < 2) {
                var spawn = spawnConstant;
                spawnLongHauler(spawn, harvestRoomflag);
            }
        }
    },
    spawnClaimer: function(spawnConstant) {
        var creepCount = _.filter(Game.creeps, (creep) => creep.memory.role == creepConstants.ROLE_CLAIMER);
        if(creepCount.length < 1) {
            var newName = Game.spawns[spawnConstant].createCreep([CLAIM, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: creepConstants.ROLE_CLAIMER});
      
        if(!newName) {
            return;
        }
            console.log('Spawning new claimer: ' + newName);
        }
    }
};

module.exports = spawnCreeps;