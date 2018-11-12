var creepConstants = require('creep.constants');
var creepState = require('creepState.extensions');
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
        if(otherCreep.id === creep.id
            || otherCreep.room.name !== creep.room.name) {
            continue;
        }

        if(otherCreep.memory.currentState
            && otherCreep.memory.currentState === state) {
            ++numberOfCreepsWithState;
        }
    }

    var creepShouldSwitch = numberOfCreepsWithState < stateCounter;

    return creepShouldSwitch;
};

Creep.prototype._work = function() {
    if(this.memory.currentState) {
        this[this.memory.currentState]();
    } else {
        //console.log('ERROR, NO STATE FOR CREEP: ' + this.name);
    }

    if(this.memory.role === creepConstants.ROLE_STANDARD) {
        standardCreepStateProvider.refreshCreepState(this);
        return;
    }

    if(this.memory.role === creepConstants.ROLE_CLAIMER) {
        claimer.refreshCreepState(this);
        return;
    }

    //longHauler.refreshCreepState(this);
};

Creep.prototype._currentStateIsValid = function () {
    if (this.memory.currentState) {
        return this[this.memory.currentState + creepConstants.STATE_ISVALID_POSTFIX]();
    }
    return false;
};

Creep.prototype._pickupGroundEnergy = function () {
    if (!this._isFull())
    {
        energy = this.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        if (energy.length) {
            if (this.pickup(energy[0]) === ERR_NOT_IN_RANGE)
                this.moveTo(energy[0]);            
        }
    }
};

Creep.prototype._fight = function() {
    var hostile = this.find(FIND_HOSTILE_CREEPS, 1);
    if (hostile !== undefined){
        this.attack(hostile);
    }
};