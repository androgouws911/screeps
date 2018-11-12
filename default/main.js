require('creep.extensions');
require('room.extensions');
require('creepState.extensions');

var spawnConstants = require('spawn.constants');
var creepConstants = require('creep.constants');
var cleanup = require('core.cleanup');
var spawnCreeps = require('spawn.creeps');

var roleTower = require('role.tower');
var roleDefense = require('role.defense');

var ticksSinceLog = 0;

module.exports.loop = function () {
    Game.consoleCommand = require('console.commands');
    cleanup.run();
    for (var i = 0; i < spawnConstants.MY_SPAWNS.length; i++) {
        var spawn = spawnConstants.MY_SPAWNS[i];
        spawnCreeps.run(creepConstants.ROLE_STANDARD, 5, spawn);
    }
    
    //spawnCreeps.spawnLongHaulers();
    //spawnCreeps.secondarySpawn(creepConstants.ROLE_STANDARD, 5);
    //spawnCreeps.secondarySpawnDefense(1);
    //spawnCreeps.spawnClaimer();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == creepConstants.ROLE_STANDARD
            || creep.memory.role == creepConstants.ROLE_LONG_HAUL
            || creep.memory.role == creepConstants.ROLE_CLAIMER) {
            creep._pickupGroundEnergy();
            creep._work();
        }

        if (creep.memory.role == creepConstants.ROLE_DEFENSE) {
            roleDefense.run(creep);
        }
    }
    roleTower.run();
};