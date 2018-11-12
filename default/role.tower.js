var roomConstants = require('room.constants');

var towerLogic = function (tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
        return;
    }
    
    var damagedFriendly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.hits < creep.hitsMax });
        
    if (damagedFriendly != undefined)
    {
        tower.heal(damagedFriendly);
    }

    if (tower.energy <= 200) {
        //Do not use energy to heal or repair if you are low. Keep it for fights
        return;
    }

    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) =>
            ((structure.structureType == STRUCTURE_WALL
                || structure.structureType == STRUCTURE_RAMPART)
                && structure.hits < 20000)
            || ((structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART)
                && structure.hits < (structure.hitsMax * 0.8))
    });

    if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }
};

var roleTower = {
    run: function () {
        for (var r = 0; r < roomConstants.MY_ROOMS.length; ++r) {
            var room = Game.rooms[roomConstants.MY_ROOMS[r]];

            if (room != undefined) {

                var towers = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                });

                for (var i = 0; i < towers.length; ++i) {
                    var tower = towers[i];
                    towerLogic(tower);
                }
            }
        }

    }
};

module.exports = roleTower;