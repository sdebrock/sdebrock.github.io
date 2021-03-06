/*

*/

ig.module(
	'game.entities.truck'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTruck = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/truck.png', 48, 20 ),
    size: {x: 48, y:20},
    offset: {x: 0, y: 0},
    race: false,
    flip: false,
    maxVel: {x: 600, y: 150},
    friction: {x: 300, y: 200},
    accelGround: 200,
    accelAir: 200,
    type: ig.Entity.TYPE.B,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 255, 255, 0.7)',
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim('drive', .07, [0,1,2]);
    },
    checkAgainst: ig.Entity.TYPE.BOTH,
    collides: ig.Entity.COLLIDES.ACTIVE,
    damage: 3,

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
                this.accel.x = -250;
            }else {
                this.accel.x = 250;
            }
        }

        this.currentAnim.flip.x = this.flip;
    this.parent();
    },

    check: function( other ) {
    //other.receiveDamage(this.damage, this);
    if (other.TYPE == 'B') {
        other.vel.x += 50;
        other.vel.y -=50;
    }
}

});



/*

 */

});