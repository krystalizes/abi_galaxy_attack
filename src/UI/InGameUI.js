import { Container, MASK_TYPES, Text, TextStyle, Texture,Ticker,TilingSprite,Graphics } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { MusicButton, SFXButton } from "./MusicButton";
import { CollisionHandler } from "../Collision/CollisonHandler";
import { StartUI } from "./StartUI";
export class InGameUI extends Container{
    constructor(){
        super();
        this.tutorial = new Container();
        this.player = new Container();
        this.playerbase = new Container();
        this.playerupgrade = new Container();
        this.creeps=[];
        this.enemyBullets=[];
        this.playerBullets=[];
        this.isInvincible = false;           
        this.addChild(this.tutorial);
        this.addChild(this.player);
        this.player.addChild(this.playerbase);
        this.player.addChild(this.playerupgrade);
        this.dx=0;
        this.dy=0;
        
        //test
        this.playerupgrade.visible=false;
        this.playerbase.visible=true;
        this.drawPowerup();
        //

        this.drawPlayerShip();  
        // test
        this.drawCreep(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.15);
        this.drawCreep(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.15);
        this.drawCreep(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.15);
        this.drawCreep(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.15);
        this.drawCreep(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.15);
        this.drawCreep(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.25);
        this.drawCreep(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.45);
        this.drawCreep(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.45);
        this.drawCreep(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.45);
        this.drawCreep(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.45);
        this.drawCreep(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.45);
        this.drawCreep(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.25);
        this.boss1=null;
        this.drawBoss();
        setInterval(() => {
            if(!this.isInvincible){
                this.startPlayerShooting();
            }
        }, 200);
        Ticker.shared.add(() => {
            if (!Game.gamestart) {
                if(!this.isInvincible){
                    this.checkCollision();
                }
                
                this.updateBullets();         
            }
            if (this.isInvincible) {
                // Don't allow mouse movement during cooldown
                Game.app.stage.off("mousemove");
                
            }
            else{
                if(!this.tutorial.parent){
                    this.move();
                }

            //     Game.app.stage.on("click", this.onStageClick.bind(this));
            // }
            //  else if (!this.isMovingAfterHit && !this.tutorial.parent && Game.playbutton_clicked) {
            //     console.log("yes");
            //     Game.app.stage.on("mousemove", this.onStageClick.bind(this));
            }
        });
        this.startCreepShooting();
        // 
        this.loopcircle();
        this.tutorial.addChild(this.drawtext());
        this.tutorial.addChild(this.drawhand());
        Game.app.stage.on("click", this.onStageClick.bind(this));
    } 
    drawPlayerShip(){
        //base
        this.playershipbase= Sprite.from(Texture.from("ship_blue_base"));
        this.playershipbase.anchor.set(0.5, 0.5);
        this.playershipbase.scale.set(0.5);
        this.playershipbase.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.8);
        this.playerbase.addChild(this.playershipbase);
        this.smokeblue= Sprite.from(Texture.from("smoke_blue"));
        this.smokeblue.anchor.set(0.5, 0.5);
        this.smokeblue.scale.set(0.5);
        this.smokeblue.position.set(this.playershipbase.x, this.playershipbase.y+61);
        this.playerbase.addChild(this.smokeblue);
        Ticker.shared.add(()=>{
            this.smokeblue.visible = !this.smokeblue.visible;
        },500);
        this.basewing=new Container();
        this.basewingleft= Sprite.from(Texture.from("spr_wing_ship_left"));
        this.basewingleft.anchor.set(1,0);
        this.basewingleft.scale.set(0.5);
        this.basewingleft.position.set(this.playershipbase.x, this.playershipbase.y+5);
        this.basewing.addChild(this.basewingleft);
        gsap.to(this.basewingleft
        ,{
            rotation:-Math.PI/18,
            duration:0.4,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "sine.inOut",
        });
        this.basewingright= Sprite.from(Texture.from("spr_wing_ship_left"));
        this.basewingright.anchor.set(1,0);
        this.basewingright.scale.set(-0.5,0.5);
        this.basewingright.position.set(this.playershipbase.x, this.playershipbase.y+5);
        this.basewing.addChild(this.basewingright);
        gsap.to(this.basewingright
            ,{
                rotation:Math.PI/18,
                duration:0.4,
                yoyo:true,
                repeat:-1,
                repeatDelay:0,
                ease: "sine.inOut",
            });
        this.playerbase.addChild(this.basewing);
        this.playerbase.setChildIndex(this.basewing,0);

        //upgrade
        this.playershipupgrade= Sprite.from(Texture.from("ship_green_base"));
        this.playershipupgrade.anchor.set(0.5, 0.5);
        this.playershipupgrade.scale.set(0.6);
        this.playershipupgrade.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.8);
        this.playerupgrade.addChild(this.playershipupgrade);
        this.smokegreen1= Sprite.from(Texture.from("smoke_green"));
        this.smokegreen1.anchor.set(0.5, 0.5);
        this.smokegreen1.scale.set(0.5);
        this.smokegreen1.position.set(this.playershipupgrade.x-20, this.playershipupgrade.y+51);
        this.playerupgrade.addChild(this.smokegreen1);
        this.smokegreen2= Sprite.from(Texture.from("smoke_green"));
        this.smokegreen2.anchor.set(0.5, 0.5);
        this.smokegreen2.scale.set(0.5);
        this.smokegreen2.position.set(this.playershipupgrade.x+20, this.playershipupgrade.y+51);
        this.playerupgrade.addChild(this.smokegreen2);
        Ticker.shared.add(()=>{
            this.smokegreen1.visible = !this.smokegreen1.visible;
            this.smokegreen2.visible = !this.smokegreen2.visible;
        },500);
        this.upgradewing=new Container();
        this.upgradewingleft= Sprite.from(Texture.from("spr_wing_ship_2_left"));
        this.upgradewingleft.anchor.set(1,0);
        this.upgradewingleft.scale.set(0.5);
        this.upgradewingleft.position.set(this.playershipupgrade.x, this.playershipupgrade.y+5);
        this.upgradewing.addChild(this.upgradewingleft);
        gsap.to(this.upgradewingleft
        ,{
            rotation:-Math.PI/18,
            duration:0.4,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "sine.inOut",
        });
        this.upgradewingright= Sprite.from(Texture.from("spr_wing_ship_2_left"));
        this.upgradewingright.anchor.set(1,0);
        this.upgradewingright.scale.set(-0.5,0.5);
        this.upgradewingright.position.set(this.playershipupgrade.x, this.playershipupgrade.y+5);
        this.upgradewing.addChild(this.upgradewingright);
        gsap.to(this.upgradewingright
            ,{
                rotation:Math.PI/18,
                duration:0.4,
                yoyo:true,
                repeat:-1,
                repeatDelay:0,
                ease: "sine.inOut",
            });
        this.playerupgrade.addChild(this.upgradewing);
        this.playerupgrade.setChildIndex(this.upgradewing,0);
    }
    drawtext(){
        const container = new Container(); 
        var text= Sprite.from(Texture.from("txt_tutorial"));
        text.anchor.set(0.5, 0.5);
        text.scale.set(0.7);
        text.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.94);
        container.addChild(text);
        return container;
    }
    loopcircle() {
        setInterval(() => {
            const circleContainer = this.drawcircle();
            this.tutorial.addChildAt(circleContainer, 0);
        }, 600);
    }
    drawcircle(){
        const container = new Container(); 
        var circle= Sprite.from(Texture.from("circle"));
        circle.anchor.set(0.5, 0.5);
        var scale=0.7;
        circle.scale.set(scale);
        circle.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.8);
        container.addChild(circle);
        Ticker.shared.add(()=>{
            if(scale>0){
                scale-=0.007;
                circle.scale.set(scale);
            }
        });
        return container;
    }
    drawhand(){
        const container = new Container(); 
        var hand= Sprite.from(Texture.from("hand"));
        hand.anchor.set(0.5, 0.5);
        hand.scale.set(0.7);
        hand.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.9);
        container.addChild(hand);
        gsap.fromTo(hand,{
            x: GameConstants.screenWidth*0.47,           
        },{
            x: GameConstants.screenWidth*0.53,      
            duration:0.7,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "power1.inOut",
        });
        return container;
    }
    drawPowerup(){
        this.powerup= Sprite.from(Texture.from("booster_power"));
        this.powerup.anchor.set(0.5, 0.5);
        this.powerup.scale.set(1);
        this.powerup.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.3);
        this.addChild(this.powerup);
    }
    checkCollision(){
        if(CollisionHandler.detectCollision(this.powerup,this.playershipbase)&&Game.is_upgrade==false){
            Game.is_upgrade=true;
            this.playerupgrade.visible=true;
            this.playerbase.visible=false;
            if(Game.sfx_music){
                sound.play("sfx_booster_collected",
                    {volume:0.1},
                );
            };
                
            this.removeChild(this.powerup);
        }
        for (let i = 0; i < this.playerBullets.length; i++) {
            const playerBullet = this.playerBullets[i];
            for (let j = 0; j < this.creeps.length; j++) {
              const creep = this.creeps[j];
              if (CollisionHandler.detectCollision(playerBullet, creep)) {
                creep.hp-=playerBullet.dmg;
                if(creep.hp<=0){
                    this.removeChild(creep);
                    this.creeps.splice(j, 1);
                    if(Game.sfx_music){
                        sound.play("sfx_enemy_explode",
                            {volume:0.1},
                        );
                    };
                }
                this.removeBullet(playerBullet, i);
                
                // if (Math.random() < 0.05) {
                //   this.spawnLives(eShip.x, eShip.y);
                // } else if(Math.random() > 0.95){
                //   this.spawnPowerUp(eShip.x, eShip.y);
                // }
                break;
              }
            }
        }
        if(!this.isInvincible){
            for (let i = 0; i < this.enemyBullets.length; i++) {
                const enemyBullet = this.enemyBullets[i];
                if (CollisionHandler.detectCollision(enemyBullet, this.playershipbase)) { 
                    this.removeBullet(enemyBullet, i, false);
                    Game.is_upgrade = false; 
                    this.playerbase.visible = true;
                    this.playerupgrade.visible = false;
                    gsap.to(this.player, {
                        x: 0,
                        y: 0,
                        duration: 0.2,
                    });    
                    gsap.to(this.player, { alpha:0, duration: 0.25, repeat:7,yoyo:true, });  
                    this.isInvincible = true;
                    setTimeout(() => {
                        this.isInvincible = false;
                    }, 2000);
                  break;
                }
              }
        }
        
    }
    onStageClick(e) {
        Game.clickCount++;
        const oldX = e.data.global.x;
        const oldY = e.data.global.y;
        var playerX = this.player.x;
        var playerY = this.player.y;
        this.dx = oldX - playerX;
        this.dy = oldY - playerY; 
        if (Game.playbutton_clicked&&this.tutorial.parent&&Game.clickCount==2) {
            this.removeChild(this.tutorial);
        }
    }
    move(){
        Game.app.stage.on("mousemove", (e) => {
            var newX = e.data.global.x;
            var newY = e.data.global.y; 
            var moveX=newX-this.dx;
            var moveY=newY-this.dy;
            
            if (moveX<=-(GameConstants.screenWidth/2-this.playershipbase.width/2)){
                this.dx=newX-this.player.x;
                moveX=-GameConstants.screenWidth/2+this.playershipbase.width/2;                  
            }
            if (moveX>=GameConstants.screenWidth/2-this.playershipbase.width/2){
                this.dx=newX-this.player.x;
                moveX=GameConstants.screenWidth/2-this.playershipbase.width/2;                  
            }
            if (moveY<=-(GameConstants.screenHeight*0.8-this.playershipbase.height/2)){
                this.dy=newY-this.player.y;
                moveY=-GameConstants.screenHeight*0.8+this.playershipbase.height/2;                  
            }
            if (moveY>=GameConstants.screenHeight*0.2-this.playershipbase.height/2){
                this.dy=newY-this.player.y;
                moveY=GameConstants.screenHeight*0.2-this.playershipbase.height/2;                  
            }
            gsap.to(this.player, {
                x: moveX,
                y: moveY,
                duration: 0.2,
            });
          });
    }
    drawCreep(x,y){
        const creepContainer = new Container();
        this.addChild(creepContainer);
        const creepMain= Sprite.from(Texture.from("spr_robot_noel_main"));
        creepMain.anchor.set(0.5, 0.5);
        creepMain.scale.set(0.5);
        creepMain.position.set(x, y);
        // creepMain.hp=10;
        creepContainer.addChild(creepMain);
        creepContainer.hp=10;
        const creepHead= Sprite.from(Texture.from("spr_robot_noel_3"));
        creepHead.anchor.set(0.5, 0.5);
        creepHead.scale.set(0.5);
        creepHead.position.set(x, y-15);
        creepContainer.addChild(creepHead);
        const creepwing=new Container();
        const creepwingleft= Sprite.from(Texture.from("spr_wing_robot_noel_3_left"));
        creepwingleft.anchor.set(1,1);
        creepwingleft.scale.set(0.5);
        creepwingleft.position.set(creepHead.x-10, creepHead.y-10);
        creepwing.addChild(creepwingleft);
        gsap.to(creepwingleft
        ,{
            rotation:-Math.PI/18,
            duration:0.4,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "sine.inOut",
        });
        const creepwingright= Sprite.from(Texture.from("spr_wing_robot_noel_3_left"));
        creepwingright.anchor.set(1,1);
        creepwingright.scale.set(-0.5,0.5);
        creepwingright.position.set(creepHead.x+10, creepHead.y-10);
        creepwing.addChild(creepwingright);
        gsap.to(creepwingright
            ,{
                rotation:Math.PI/18,
                duration:0.4,
                yoyo:true,
                repeat:-1,
                repeatDelay:0,
                ease: "sine.inOut",
            });
        creepContainer.addChild(creepwing);
        creepContainer.setChildIndex(creepwing,0);
        this.creeps.push(creepContainer);
        const containerIndex = this.creeps.indexOf(creepContainer);
        if(containerIndex%2==0){
            gsap.to(creepContainer
                ,{
                    y: -GameConstants.screenHeight * 0.025,
                    duration: 1,
                    repeat: -1,
                    repeatDelay: 0,
                    yoyo: true,
                    ease: "power0.inOut",
                });
        }
        else{
            gsap.to(creepContainer
                ,{
                    y: GameConstants.screenHeight * 0.025,
                    duration: 1,
                    repeat: -1,
                    repeatDelay: 0,
                    yoyo: true,
                    ease: "power0.inOut",
                });
        }
    }
    startPlayerShooting(){
        if (!this.tutorial.parent) {
            const playerBaseGlobalPosition = this.playerbase.toGlobal(this.playershipbase.position);
            this.playerShoot(playerBaseGlobalPosition.x,playerBaseGlobalPosition.y-this.playershipbase.height/2);
            if(Game.sfx_music){
                sound.play("sfx_shoot",
                    {volume:0.1},
                );
            }
        }
    }
    startCreepShooting() {
        const creepShootHandler = () => {
            if (!this.tutorial.parent) {
                if (Math.random() <0.001 && this.boss1.parent) {
                    this.bossShoot(this.boss1.x,this.boss1.y+this.boss1.height/2);
                }
                for (const creep of this.creeps) {
                    if (Math.random() < 0.001 ) {
                        const creepMain = creep.getChildAt(1);
                        this.creepShoot(creepMain.x, creepMain.y + creepMain.height / 2);
                    }
                }
            }
        };
        Ticker.shared.add(creepShootHandler);
    }
    drawPlayerBullet(){
        if(this.playerbase.visible){
            const playerbasebullet=Sprite.from(Texture.from("bullet_blue"));
            playerbasebullet.anchor.set(0.5, 0.5);
            playerbasebullet.scale.set(0.8);
            playerbasebullet.dmg=2;
            this.addChildAt(playerbasebullet,0);
            return playerbasebullet;
        }
        else{
            const playerupgradebullet=Sprite.from(Texture.from("bullet_green"));
            playerupgradebullet.anchor.set(0.5, 0.5);
            playerupgradebullet.scale.set(0.8);
            playerupgradebullet.dmg=4;
            this.addChildAt(playerupgradebullet,0);
            return playerupgradebullet;
        }
    }
    drawBoss(){
        const bossImg=Sprite.from(Texture.from("spr_ginger_boy"));
        bossImg.anchor.set(0.5, 0.5);
        bossImg.scale.set(0.8);
        bossImg.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.25);
        bossImg.hp=50;
        this.addChild(bossImg);
        this.creeps.push(bossImg);
        gsap.fromTo(
            bossImg,
            { rotation:-Math.PI*1/16 },
            {
                rotation: Math.PI*1/16, 
                duration: 0.8, 
                repeat: -1,
                yoyo: true, 
                ease: "power1.inOut",
            }
        );
        this.boss1=bossImg;
    }
    drawBossBullet(){
        const bossbullet=Sprite.from(Texture.from("spr_candy_bullet"));
        bossbullet.anchor.set(0.5, 0.5);
        bossbullet.scale.set(0.8);
        this.addChildAt(bossbullet,0);
        return bossbullet;
    }
    drawCreepBullet(){
        const creepbullet=Sprite.from(Texture.from("bullet_enemy"));
        creepbullet.anchor.set(0.5, 0.5);
        creepbullet.scale.set(0.8);
        this.addChildAt(creepbullet,0);
        return creepbullet;
    }
    bossShoot(x, y) {
        let bullet = this.drawBossBullet();
        bullet.x = x;
        bullet.y = y;
        bullet.speed = 4;
        this.enemyBullets.push(bullet);
    }
    creepShoot(x, y) {
        let bullet = this.drawCreepBullet();
        bullet.x = x;
        bullet.y = y;
        bullet.speed = 4;
        this.enemyBullets.push(bullet);
    }
    playerShoot(x,y){
        let bullet1 = this.drawPlayerBullet();
        let bullet2 = this.drawPlayerBullet();
        bullet1.x = x;
        bullet1.y = y+50;
        bullet2.x = x;
        bullet2.y = y+50;
        bullet1.speed = -10;
        bullet2.speed = -10;
        gsap.fromTo(bullet1, { x: bullet1.x, y: bullet1.y }, { x: x-20, y: y-20, duration: 0.25 });
        gsap.fromTo(bullet2, { x: bullet2.x, y: bullet2.y }, { x: x+20, y: y-20, duration: 0.25 });
        this.playerBullets.push(bullet1,bullet2);
    }
    updateBullets() {
        for (let i = 0; i < this.playerBullets.length; i++) {
            const bullet = this.playerBullets[i];
            bullet.y += bullet.speed;
        
    
        //   if (bullet.y < 0) {
        //     this.removeBullet(bullet, i);
        //   }
        }  

        for (let i = 0; i < this.enemyBullets.length; i++) {
            const bullet = this.enemyBullets[i];
            bullet.y += bullet.speed;
            if (bullet.y >= GameConstants.screenHeight) {
              this.removeBullet(bullet, i, false);
            }
          }
    }
    removeBullet(bullet, index, isPlayerBullet = true) {
        this.removeChild(bullet);
        if (isPlayerBullet) {
          this.playerBullets.splice(index, 1);
        } else {
          this.enemyBullets.splice(index, 1);
        }
      }
}