/*

*/

ig.module(
	'game.entities.life'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLife = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/life.png', 20, 20 ),
    size: {x: 20, y: 20},
    offset: {x: 0, y: 0},
    maxVel: {x: 300, y: 0},
    friction: {x: 0, y: 0},
    flip: false,
    _wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
    
    checkAgainst: ig.Entity.TYPE.A,
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.setupAnimation();
        this.startPosition = {x:x,y:y};
    },
    setupAnimation: function(){
        this.addAnim('idle', 1, [0,1,2,3]);
    },
    
    update: function() {
        if ( ig.game.driving == true ){
            this.vel.x = 300;
        }

        if (this.flip == false) {
            this.vel.x = Math.abs(this.vel.x);
            if (this.pos.x > 120048) {
                this.pos.x = -448;
            }
        }else {
            this.vel.x = -Math.abs(this.vel.x);
            if (this.pos.x < -448) {
                this.pos.x = 120048;
            }
        }
    },
    
    check: function( other ) {
        if (other) {
            ig.game.lives++;
            this.kill();
        }
    }

});



/*
 
*/

});
