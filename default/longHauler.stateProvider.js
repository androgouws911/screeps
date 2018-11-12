var roomConstants = require('room.constants');
var creepConstants = require('creep.constants');
var flags = require('flags');

var findClosestFlagToCreep = function(creep, flags) {
    var flagObjects = [];
    for(var i = 0; i < flags.length; ++i) {
        var flag = Game.flags[flags[i]];
        flagObjects.push(flag);
    }

    var closestFlag = creep.pos.findClosestByPath(flagObjects);
    //console.log('Closest flag by path: ' + closestFlag);
};

var getMoveFlagForCreep = function(creep) {
    if(creep.room.name == roomConstants.ROOM_PRIMARY) {
        return flags.HARVEST_FLAG_1;
    }

    //if(creep.room.name == roomConstants.ROOM_SECONDARY) {
    //    return flags.HARVEST_FLAG_2;
    //}

    if (creep.room.name == roomConstants.ROOM_HARVEST1) {
        return flags.PRIMARY_ROOM_FLAG;
    }

    //if(creep.room.name == roomConstants.ROOM_HARVEST2
    //    || creep.room.name == roomConstants.ROOM_HARVEST3
    //    || creep.room.name == roomConstants.ROOM_HARVEST4){
    //    return flags.SECONDARY_ROOM_FLAG;
    //}

    return null;
};

var creepIsInOneOfMyRooms = function(creep) {
    for(var i = 0; i < roomConstants.MY_ROOMS.length; ++i) {
        if(creep.room.name == roomConstants.MY_ROOMS[i]) {
            return true;
        }
    }

    return false;
};

module.exports = {
    refreshCreepState: function (creep) {
        var hostileCount = Game.rooms[creep.room.name].find(FIND_HOSTILE_CREEPS).length;
        if(hostileCount > 0
            && !creepIsInOneOfMyRooms(creep)
            && creep.memory.currentState == creepConstants.STATE_HARVEST) {
            creep.memory.targetFlag = getMoveFlagForCreep(creep);
            console.log('PANIC! ENEMY, RUN AWAY TO BASE: [' + creep.memory.targetFlag + ']');
            creep._setCreepState(creep, creepConstants.STATE_MOVE_TO_FLAG);
        }
        
        if (creep.ticksToLive < 25)
        {           
            creep._setCreepState(creep, creepConstants.STATE_RENEW);
            return;
        }

        if (creep._currentStateIsValid()) {
            return;
        }

        //TODO clear memory for each state?
        creep.memory.sourceToHarvest = null;
        creep.memory.currentState = null;
        creep.memory.targetFlag = null;
        //console.log('long hauler update state. IsEmpty: [' + creep._isEmpty() + ']; Room: ['+creep.room.name+']');

        //creep is in my rooms
        if(creep._isEmpty()
            && creepIsInOneOfMyRooms(creep)
            && creep.memory.harvestRoomFlag) {
            creep.memory.targetFlag = creep.memory.harvestRoomFlag;
            //console.log('Setting creep to move to flag state with flag: [' +creep.memory.targetFlag + ']');
            creep._setCreepState(creep, creepConstants.STATE_MOVE_TO_FLAG);
            return;
        }

        if((creep._isEmpty() && creepIsInOneOfMyRooms(creep))
            || (!creep._isEmpty() && !creepIsInOneOfMyRooms(creep))) {
            creep.memory.targetFlag = getMoveFlagForCreep(creep);
            //creep.memory.targetFlag = flags.HARVEST_FLAG_1;
            //console.log('Setting creep to move to flag state with flag: [' +creep.memory.targetFlag + ']');
            creep._setCreepState(creep, creepConstants.STATE_MOVE_TO_FLAG);
            return;
        }

        if (creep._isEmpty() && !creepIsInOneOfMyRooms(creep)) {
            //console.log('Settings creep to harvest state');
            creep._setCreepState(creep, creepConstants.STATE_HARVEST);
            return;
        }

        if (!creep._isEmpty() && creepIsInOneOfMyRooms(creep)) {
            //console.log('Setting creep to deposit to container state');
            creep._setCreepState(creep, creepConstants.STATE_LOAD_CONTAINER);
            return;
        }

        console.log('SOMETHING IS WRONG WITH LONG RANGE HARVESTER');
    }
};