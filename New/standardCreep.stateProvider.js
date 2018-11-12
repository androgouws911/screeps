var creepConstants = require('creep.constants');
var roomConstants = require('room.constants');

module.exports = {
    refreshCreepState : function(creep) {

        if(creep._currentStateIsValid()) {
            return;
        }

        creep.memory.sourceToHarvest = null;
        //we need to assign a state to the creep, for there is work to be done
        //if the creep is empty, then always go harvest
        if (creep._isEmpty()) {
            creep._setCreepState(creep, creepConstants.STATE_HARVEST);
            return;
        }

        creep.memory.currentState = null;
        if (creep.memory.role == creepConstants.ROLE_OUTSOURCE
            && creep.room.name == roomConstants.ROOM_PRIMARY) {
            creep._setCreepState(creep, creepConstants.STATE_OUTSOURCE);
            return;
        }

        //while I have not yet received a state. Create a work counter
        var stateCounter = 1;
        while(!creep.memory.currentState) {
            if(creep.room._aSpawnOrExtensionRequiresEnergy()) {
                if(creep._shouldCreepSwitchToState(creep, creepConstants.STATE_LOADENERGY, stateCounter)) {
                    creep._setCreepState(creep, creepConstants.STATE_LOADENERGY);
                    continue;
                }
            }

            if(creep.room._aTowerRequiresEnergy()) {
                if(creep._shouldCreepSwitchToState(creep, creepConstants.STATE_TOWER, stateCounter)) {
                    creep.memory.towerToLoad = null;
                    creep._setCreepState(creep, creepConstants.STATE_TOWER);
                    continue;
                }
            }

            if(creep.room._roomHasConstructionSites()) {
                if(creep._shouldCreepSwitchToState(creep, creepConstants.STATE_BUILD, stateCounter)) {
                    creep._setCreepState(creep, creepConstants.STATE_BUILD);
                    continue;
                }
            }

            if(creep.room._roomHasRepairSites()) {
                if(creep._shouldCreepSwitchToState(creep, creepConstants.STATE_REPAIR, stateCounter)) {
                    creep._setCreepState(creep, creepConstants.STATE_REPAIR);
                    continue;
                }
            }

            if (creep._shouldCreepSwitchToState(creep, creepConstants.STATE_UPGRADE, stateCounter)) {
                creep._setCreepState(creep, creepConstants.STATE_UPGRADE);
            }

            ++stateCounter;
            if(stateCounter > 100) {
                console.log('THERE IS A BUG IN refreshCreepState, ABORT!!!!!');
                return;
            }
        }
    }
};