/*

*/

ig.module(
	'game.entities.lambo'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLambo = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/lambo.png', 48, 12 ),
    size: {x: 48, y:12},
    offset: {x: 0, y: 0},
    race: false,
    flip: false,
    health:1000,
    maxVel: {x: 1000, y: 150},
    friction: {x: 300, y: 200},
    accelGround: 500,
    accelAir: 500,
    type: ig.Entity.TYPE.B,
    invincible: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 255, 255, 0.7)',
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim('drive', .27, [0,1,2]);
    },
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.ACTIVE,
    damage: 5,

    update: function() {

        if (this.flip == false) {
            this.vel.x = Math.abs(this.vel.x);
            if (this.pos.x > 80048) {
                this.pos.x = -448;
            }
        }else {
            this.vel.x = -Math.abs(this.vel.x);
            if (this.pos.x < -448) {
                this.pos.x = 80048;
            }
        }
        if ( Math.abs(this.vel.x) < 100 ) {
            if (this.flip) {
                this.accel.x = -750;
            }else {
                this.accel.x = 750;
            }
        }

        this.currentAnim.flip.x = this.flip;
    this.parent();
    },
    receiveDamage: function(amount, from){
        if(this.invincible)
            return;
        this.parent(amount, from);
    },

    check: function( other ) {

        this.vel.x -= 500;
        other.kill();

}

});



/*

 */

});