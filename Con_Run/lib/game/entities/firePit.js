/*

*/

ig.module(
	'game.entities.firePit'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityFirePit = ig.Entity.extend({
    _wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
    
    checkAgainst: ig.Entity.TYPE.BOTH,
    
    update: function() {},
    
    check: function( other ) {
        other.kill()
    }

});



/*
 
*/

});