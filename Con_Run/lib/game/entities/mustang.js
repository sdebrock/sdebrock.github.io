/*

*/

ig.module(
	'game.entities.mustang'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMustang = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/mustang.png', 48, 16 ),
    size: {x: 48, y:16},
    offset: {x: 0, y: 0},
    race: false,
    flip: false,
    maxVel: {x: 600, y: 150},
    friction: {x: 300, y: 400},
    accelGround: 200,
    accelAir: 200,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.BOTH,
    collides: ig.Entity.COLLIDES.ACTIVE,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 255, 255, 0.7)',
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim('drive', .07, [0,1,2]);
    },

    damage: 3,
    
    update: function() {

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
        this.currentAnim.flip.x = this.flip;
        if ( Math.abs(this.vel.x) < 100 ) {
            if (this.flip) {
                this.accel.x = -250;
            }else {
                this.accel.x = 250;
            }
        }
        this.parent();
    },
    
    check: function( other ) {
        other.receiveDamage(this.damage, this);
        if (other.TYPE == 'B') {
            other.vel.x += 50;
            this.accel.y =16;
        }
    }

});


        EntityDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 25,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
        });
        EntityDeathExplosionParticle = ig.Entity.extend({
            size: {x: 2, y: 2},
            maxVel: {x: 160, y: 300},
            lifetime: 2,
            fadetime: 1,
            bounciness: 0,
            vel: {x: 100, y: 30},
            friction: {x:100, y: 0},
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 0,
            totalColors: 7,
            animSheet: new ig.AnimationSheet( 'media/explosion2.png', 4, 4 ),
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
                this.idleTimer = new ig.Timer();
                var frameID = Math.round(Math.random()*7);
                this.addAnim( 'idle', 0.2, [frameID] );
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.lifetime - this.fadetime, this.lifetime,
                    1, 0
                );
                this.parent();
            }
        });

/*
 
*/

});
