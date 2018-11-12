var creepConstants = require('creep.constants');
var standardCreepStateProvider = require('standardCreep.stateProvider');
var longHauler = require('longHauler.stateProvider');
var claimer = require('claimer.stateProvider');

Creep.prototype._setCreepState = function(creep, state) {
    creep.say(state);
    creep.memory.currentState = state;
};

Creep.prototype._shouldCreepSwitchToState = function(creep, state, stateCounter) {
    var numberOfCreepsWithState = 0;
    for(var name in Game.creeps) {
        var otherCreep = Game.creeps[name];
        if(otherCreep.id == creep.id
            || otherCreep.room.name != creep.room.name) {
            continue;
        }

        if(otherCreep.memory.currentState
            && otherCreep.memory.currentState == state) {
            ++numberOfCreepsWithState;
        }
    }

    var creepShouldSwitch = numberOfCreepsWithState < stateCounter;
    // console.log('Should creep [' + creep.name + '] in room [' + creep.room.name + '] switch to state: [' + state + ']?');
    // console.log('Number of creeps with state [' + numberOfCreepsWithState + '] counter [' + stateCounter + '] ANSWER: ['+creepShouldSwitch+']');

    return creepShouldSwitch;
};

Creep.prototype._work = function() {
    if(this.memory.currentState) {
        this[this.memory.currentState]();
    } else {
        //console.log('ERROR, NO STATE FOR CREEP: ' + this.name);
    }

    if(this.memory.role == creepConstants.ROLE_STANDARD) {
        standardCreepStateProvider.refreshCreepState(this);
        return;
    }

    if(this.memory.role == creepConstants.ROLE_CLAIMER) {
        claimer.refreshCreepState(this);
        return;
    }

    longHauler.refreshCreepState(this);
};

Creep.prototype._currentStateIsValid = function() {
    if (this.memory.currentState) {
        return this[this.memory.currentState + creepConstants.STATE_ISVALID_POSTFIX]();
    }

    return false;
};

Creep.prototype._pickupGroundEnergy = function () {
    if (this.pos.findInRange(FIND_DROPPED_RESOURCES, 1).length) {
        this.pickup(this.pos.findInRange(FIND_DROPPED_RESOURCES, 1)[0]);
    }
};

Creep.prototype._fight = function() {
    var hostile = this.find(FIND_HOSTILE_CREEPS, 1);
    if (hostile != undefined){
        this.attack(hostile);
    }
};