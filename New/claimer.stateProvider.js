var creepConstants = require('creep.constants');
var roomConstants = require('room.constants');
var flags = require('flags');

module.exports = {
    refreshCreepState: function (creep) {
        creep.memory.currentState = null;
    //       if (creep.room.name != roomConstants.ROOM_SECONDARY)
    //    {
    //        creep.memory.targetFlag = flags.SECONDARY_ROOM_FLAG;
    //        creep._setCreepState(creep, creepConstants.STATE_MOVE_TO_FLAG);
    //        return;
    //    }

    //    var controllerToClaim = Game.getObjectById('4f6651fdc69741e');
    //    var claimControllerResult = creep.reserveController(controllerToClaim);
    //    console.log('Claim controller result ' + claimControllerResult);
        
     
      
    //    if (claimControllerResult == ERR_NOT_IN_RANGE) {
    //        creep.moveTo(controllerToClaim);
    //    }

    //    return;

    //    if (creep._currentStateIsValid()) {
    //        return;
    //    }

    //    creep.memory.currentState = null;
    //    creep.memory.targetFlag = null;

    //    if(creep.room.name == roomConstants.ROOM_HARVEST2) {
    //        creep.memory.targetFlag = flags.PRIMARY_ROOM_SPAWN_FLAG;
    //        creep._setCreepState(creep, creepConstants.STATE_MOVE_TO_FLAG);
    //        return;
    //    }

    //    var controllerToClaim = Game.getObjectById('4f6651fdc69741e');
    //    var claimControllerResult = creep.reserveController(controllerToClaim);
    //    console.log('Claim controller result2 ' + claimControllerResult);
    //    if (claimControllerResult == ERR_NOT_IN_RANGE) {
    //        creep.moveTo(controllerToClaim);
    //    }
    }
};
