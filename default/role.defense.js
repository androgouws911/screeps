/**
 * Created by leol on 2016-12-04.
 */
module.exports = {
    run: function(creep) {
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if(!hostiles || hostiles.length == 0) {
            creep.memory.state = 'idle';
            return;
        }

        if(creep.memory.state != 'attack!') {
            creep.memory.state = 'attack!';
            creep.say('Attack!');
        }

        var attackResult = creep.attack(hostiles[0]);
        if(attackResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostiles[0]);
        }
    }
};