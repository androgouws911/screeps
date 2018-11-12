var quickCommands = {
    logTicks: function () {
        console.log("CREEPS TICKS TO LIVE:");
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            console.log(creep.name + " - " + creep.ticksToLive);
        }
        return "";
    }
}



module.exports = quickCommands;