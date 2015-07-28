ig.module(
    'game.entities.porsche'
)
.requires(
    'impact.entity',
    'impact.sound'
)
.defines(function(){
    EntityPorsche = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/porsche.png', 48, 16 ),
        size: {x: 48, y:16},
        offset: {x: 0, y: 0},
        flip: false,
        maxVel: {x: 1001, y: 150},
        friction: {x: 300, y: 400},
        accelGround: 750,
        accelAir: 750,
        jump: 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,
        //weapon: 0,
        //totalWeapons: 3,
        //activeWeapon: "EntitySword",
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
        jumpSFX: new ig.Sound( 'media/sounds/jump.*' ),
        shootSFX: new ig.Sound( 'media/sounds/shoot.*' ),
        deathSFX: new ig.Sound( 'media/sounds/death.*' ),
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
            this.setupAnimation(0);
            this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();

        },
        setupAnimation: function(offset){
            offset = offset * 10;
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', .07, [0,1,2]);
            this.addAnim('jump', 1, [0]);
            this.addAnim('fall', 0.4, [0]);
        },
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        update: function() {
            if (this.flip == false) {
                this.vel.x = Math.abs(this.vel.x);
                if (this.pos.x > 79990) {
                    this.pos = this.startPosition;
                    ig.game.lives--;
                }
            }else {
                this.vel.x = -Math.abs(this.vel.x);
                if (this.pos.x < -48) {
                    this.flip = false;
                    this.vel.x = 300;
                }
            }
              // move left, right, up, or down
        	var accel = this.standing ? this.accelGround : this.accelAir;
            if( ig.input.state('flip') && Math.abs(this.vel.x) < 5) {
                this.vel.x = 5;
                this.accel.x = 0;
                if ( this.flip == false){
                    this.flip = true;
                }else {
                    this.flip = false;
                }
            }else if( ig.input.state('left') && ig.input.state('up') ) {
        		if (this.flip){
                    this.accel.x = -accel;
                    this.accel.y = -accel;
                }else{
                    this.accel.x = -accel;
                    this.accel.y = -accel;
                }
        	}else if( ig.input.state('right') && ig.input.state('up') ) {
                if (this.flip){
                    this.accel.x = accel;
                    this.accel.y = -accel;
                }else{
                    this.accel.x = accel;
                    this.accel.y = -accel;
                }
        	}else if( ig.input.state('left') && ig.input.state('down') ) {
                if (this.flip){
                    this.accel.x = -accel;
                    this.accel.y = accel;
                }else {
                    this.accel.x = -accel;
                    this.accel.y = accel;
                }
            }else if( ig.input.state('right') && ig.input.state('down') ) {
                if (this.flip){
                    this.accel.x = accel;
                    this.accel.y = accel;
                }else{
                    this.accel.x = accel;
                    this.accel.y = accel;
                }
            }else if( ig.input.state('left') ) {
                if (this.flip){
                    this.accel.x = -accel;
                    this.vel.y = 0;
                    this.accel.y = 0;
                }else{
                    this.accel.x = -accel;
                    this.vel.y = 0;
                    this.accel.y = 0;
                }
            }else if( ig.input.state('right') ) {
                if (this.flip){
                    this.accel.x = accel;
                    this.vel.y = 0;
                    this.accel.y = 0;
                }else {
                    this.accel.x = accel;
                    this.vel.y = 0;
                    this.accel.y = 0;
                }
            }else{
        		this.accel.x = 0;
                this.vel.y = 0;
                this.accel.y = 0;
        	}

        	// jump
        	if( this.standing && ig.input.pressed('jump') ) {
        		this.vel.y = -this.jump;
                this.jumpSFX.play();
        	}
            // shoot
            if( ig.input.pressed('shoot') ) {
            	ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );
                this.shootSFX.play();
            }
            if( ig.input.pressed('switch') ) {
            	
                
                
            }
            // set the current animation, based on the player's speed
            if( this.vel.y < 0 ) {
            	this.currentAnim = this.anims.jump;
            }else if( this.vel.y > 0 ) {
            	this.currentAnim = this.anims.fall;
            }else if( this.vel.x != 0 ) {
            	this.currentAnim = this.anims.run;
            }else{
            	this.currentAnim = this.anims.idle;
            }
            this.currentAnim.flip.x = this.flip;
            if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
        	// move!
        	this.parent();
        },
        kill: function(){
            this.deathSFX.play();
            this.parent();
            ig.game.respawnPosition = this.startPosition;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath} );
        },
        onDeath: function(){
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity( EntityPorsche, this.last.x+1000, this.last.y);
            }
        },
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.parent(amount, from);
        },
        draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            this.parent();
        },
        check: function( other ) {

            this.vel.x -= 500;
            other.receiveDamage(1, this);
            other.pos.y = other.pos.y-50;
            if (!other.invincible) {
                //other.kill();
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
            maxVel: {x: 160, y: 200},
            lifetime: 2,
            fadetime: 1,
            bounciness: 0,
            vel: {x: 100, y: 30},
            friction: {x:100, y: 0},
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 0,
            totalColors: 7,
            animSheet: new ig.AnimationSheet( 'media/explosion.png', 1, 1 ),
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
    });
