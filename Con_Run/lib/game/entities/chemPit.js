/*

*/

ig.module(
	'game.entities.chemPit'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityChemPit = ig.Entity.extend({
    _wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 200, 75, 0.7)',
    
    checkAgainst: ig.Entity.TYPE.B,
    
    update: function() {},
    
    check: function( other ) {
        other.kill()
    }

});



/*
 
*/

});
