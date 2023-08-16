import { Container, MASK_TYPES, Text, TextStyle, Texture,Ticker,TilingSprite,Graphics, Point } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { CollisionHandler } from "../Collision/CollisonHandler";
export class InGameUI extends Container{
    constructor(){
        super();
        this.startGame();
        Ticker.shared.add(() => {
            if (!Game.gameover) {
                this.checkCollision();
                this.updateBullets(); 
                this.updatebooster();   
                this.startCreepShooting();

                if(Game.wave==3){
                    this.updateCreep3();
                }  
                if (this.isInvincible) {
                    Game.app.stage.off("mousemove");
                }
                else{
                    if(!this.tutorial.parent){
                        this.move();
                    }
                }   
            }
        });
       
    } 
    startGame(){
        Game.gameover=false;
        this.tutorial = new Container();
        this.player = new Container();
        this.playerbase = new Container();
        this.playerupgrade = new Container();
        this.creeps=[];
        this.lives=3;
        this.point=0;
        this.enemyBullets=[];
        this.playerBullets=[];
        this.bulletlvlupArray=[];
        this.isInvincible = false;           
        this.addChild(this.tutorial);
        this.addChild(this.player);
        this.player.addChild(this.playerbase);
        this.player.addChild(this.playerupgrade);
        this.dx=0;
        this.dy=0;
        this.bulletCount = 2;
        this.playerupgrade.visible=false;
        this.playerbase.visible=true;
        this.drawPlayerShip();  
        this.drawCreep1(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.15);
        this.drawCreep1(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.15);
        this.drawCreep1(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.15);
        this.drawCreep1(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.15);
        this.drawCreep1(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.15);
        this.drawCreep1(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.25);
        this.drawCreep1(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.45);
        this.drawCreep1(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.45);
        this.drawCreep1(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.45);
        this.drawCreep1(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.45);
        this.drawCreep1(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.45);
        this.drawCreep1(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.25);
        this.boss1=null;
        this.boss2=null;
        this.drawBoss1(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.25);
        this.shootingInterval = setInterval(() => {
            if (!this.isInvincible && !Game.gameover) {
                this.startPlayerShooting();
            }
        }, 200);
        
        this.loopcircle();
        this.tutorial.addChild(this.drawtext());
        this.tutorial.addChild(this.drawhand());
        this.pointText = new Text(`Points: ${this.point}`, { fill: 0xffffff });
        this.pointText.position.set(10, 10);
        this.addChild(this.pointText);
        this.livesText = new Text(`Remaining lives: ${this.lives}`, { fill: 0xffffff });
        this.livesText.position.set(10, 40);
        this.addChild(this.livesText);
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
        this.circleSpawnInterval = setInterval(() => {
            if (!Game.gameover) {
                const circleContainer = this.drawcircle();
                this.tutorial.addChildAt(circleContainer, 0);
            }
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
    drawPowerup(x,y){
        this.powerup= Sprite.from(Texture.from("booster_power"));
        this.powerup.anchor.set(0.5, 0.5);
        this.powerup.scale.set(1);
        this.powerup.position.set(x, y);
        this.addChild(this.powerup);
    }
    drawBulletLvlup(x,y){
        const sprite = Sprite.from(Texture.from("booster_levelup"));
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(1);
        sprite.position.set(x,y);
        this.addChild(sprite);
        this.bulletlvlupArray.push(sprite);
    }
    checkCollision(){
        if(this.powerup){
            if(CollisionHandler.detectCollision(this.powerup,this.playershipbase)){
                Game.is_upgrade=true;
                this.playerupgrade.visible=true;
                this.playerbase.visible=false;
                const glow=Sprite.from(Texture.from("spr_star"));
                glow.anchor.set(0.5, 0.5);
                glow.scale.set(1.5);
                glow.position.set(this.playershipbase.x, this.playershipbase.y);
                this.player.addChildAt(glow,0);
                gsap.to(glow,
                    {
                        alpha:0,
                        repeat:2,
                        yoyo:true,
                        duration:0.2,
                    });
                if(Game.sfx_music){
                    sound.play("sfx_booster_collected",
                        {volume:0.1},
                    );
                };
                    
                this.removeChild(this.powerup);
            }
        }

        for (let i = 0; i < this.bulletlvlupArray.length; i++) {
            const lvlup = this.bulletlvlupArray[i];
            if (CollisionHandler.detectCollision(lvlup, this.playershipbase)) { 
                const glow=Sprite.from(Texture.from("spr_white_glow"));
                glow.anchor.set(0.5, 0.5);
                glow.scale.set(1.5);
                glow.position.set(this.playershipbase.x, this.playershipbase.y);
                this.player.addChildAt(glow,0);
                gsap.to(glow,
                    {
                        alpha:0,
                        repeat:2,
                        yoyo:true,
                        duration:0.2,
                    });
                if(Game.sfx_music){
                    sound.play("sfx_booster_collected",
                        {volume:0.1},
                    );
                };
                this.bulletlvlupArray.splice(i, 1);
                this.removeChild(lvlup);
                this.bulletCount+=1;
                break;
            }
        }

        
        for (let i = 0; i < this.playerBullets.length; i++) {
            const playerBullet = this.playerBullets[i];
            for (let j = 0; j < this.creeps.length; j++) {
              const creep = this.creeps[j];
              if (CollisionHandler.detectCollision(playerBullet, creep)) {
                creep.hp-=playerBullet.dmg;
                if(creep.hp<=0){
                    if (creep === this.boss1||creep === this.boss2) {
                        if (Game.sfx_music) {
                            sound.play("sfx_explosion", { volume: 0.1 });
                        }
                        this.point+=5;
                        this.updatePointText();
                        this.drawPowerup(creep.x,creep.y);
                    } else {
                        if (Game.sfx_music) {
                            sound.play("sfx_enemy_explode", { volume: 0.1 });
                        }
                        this.point+=1;
                        this.updatePointText();
                        if(Math.random() > 0.75){
                            const creepmain=creep.getChildAt(1);
                            this.drawBulletLvlup(creepmain.x,creepmain.y);
                        }
                    }
                    this.removeChild(creep);
                    this.creeps.splice(j, 1);
                    if (this.creeps.length == 0 ) {
                        Game.wave++;
                        if(Game.wave==2){
                            this.secondWaveText();
                        }else{
                            this.thirdWaveText();
                        }
                    }
                }
                this.removeBullet(playerBullet, i);
                break;
              }
            }
        }
        if(!this.isInvincible){
            for (let i = 0; i < this.enemyBullets.length; i++) {
                const enemyBullet = this.enemyBullets[i];
                if (CollisionHandler.detectCollision(enemyBullet, this.playershipbase)) { 
                    this.removeBullet(enemyBullet, i, false);
                    this.lives--;
                    this.updateLivesText();
                    if (this.lives <= 0) {
                        Game.gameover = true;
                        Game.clickCount=-1;
                        
                        Game.lose(this.point);
                    }
                    Game.is_upgrade = false; 
                    if(this.bulletCount>2){
                        this.bulletCount--;
                    }
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
            for (let i = 0; i < this.creeps.length; i++) {
                const creep = this.creeps[i];
                if (CollisionHandler.detectCollision(creep, this.playershipbase)) { 
                    this.lives--;
                    this.updateLivesText();
                    if (this.lives <= 0) {
                        Game.gameover = true;
                        Game.clickCount=-1;
                        Game.lose(this.point);
                    }
                    if(Game.sfx_music){
                        sound.play("sfx_explode",
                            {volume:0.1},
                        );
                    };
                    Game.is_upgrade = false; 
                    if(this.bulletCount>2){
                        this.bulletCount--;
                    }
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
            this.tutorial.removeChildren();
            this.removeChild(this.tutorial);
            this.drawPauseButton();
            this.move();
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
    drawCreep1(x,y){
        const creepContainer = new Container();
        this.addChild(creepContainer);
        const creepMain= Sprite.from(Texture.from("spr_robot_noel_main"));
        creepMain.anchor.set(0.5, 0.5);
        creepMain.scale.set(0.5);
        creepMain.position.set(x, y);
        creepContainer.addChild(creepMain);
        creepContainer.hp=20;
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
    drawCreep2(x,y){
        const creepContainer = new Container();
        this.addChild(creepContainer);
        const creepMain= Sprite.from(Texture.from("spr_robot_noel_main"));
        creepMain.anchor.set(0.5, 0.5);
        creepMain.scale.set(0.5);
        creepMain.position.set(x, y);
        creepContainer.addChild(creepMain);
        creepContainer.hp=40;
        const creepHead= Sprite.from(Texture.from("spr_robot_noel_2"));
        creepHead.anchor.set(0.5, 0.5);
        creepHead.scale.set(0.7);
        creepHead.position.set(x, y-15);
        creepContainer.addChild(creepHead);
        const creepwing=new Container();
        const creepwingleft= Sprite.from(Texture.from("spr_wing_robot_noel_2_left"));
        creepwingleft.anchor.set(1,1);
        creepwingleft.scale.set(0.7);
        creepwingleft.position.set(creepHead.x-10, creepHead.y);
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
        const creepwingright= Sprite.from(Texture.from("spr_wing_robot_noel_2_left"));
        creepwingright.anchor.set(1,1);
        creepwingright.scale.set(-0.7,0.7);
        creepwingright.position.set(creepHead.x+10, creepHead.y);
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
        
    }
    drawCreep3(x,y){
        const creepContainer = new Container();
        this.addChild(creepContainer);
        const creepMain= Sprite.from(Texture.from("spr_elf"));
        creepMain.anchor.set(0.5, 0.5);
        creepMain.scale.set(1);
        creepMain.position.set(x, y);
        creepContainer.addChild(creepMain);
        creepContainer.hp=40;
        const creepwing=new Container();
        const creepwingleft= Sprite.from(Texture.from("spr_elf_ear_left"));
        creepwingleft.anchor.set(1,1);
        creepwingleft.scale.set(0.7);
        creepwingleft.position.set(creepMain.x-20, creepMain.y);
        creepwing.addChild(creepwingleft);
        setInterval(() => {
            gsap.to(creepwingleft
                ,{
                    rotation:-Math.PI/18,
                    duration:0.1,
                    yoyo:true,
                    repeat:3,
                    repeatDelay:0,
                    ease: "sine.inOut",
                });
        }, 1000);
        const creepwingright= Sprite.from(Texture.from("spr_elf_ear_left"));
        creepwingright.anchor.set(1,1);
        creepwingright.scale.set(-0.7,0.7);
        creepwingright.position.set(creepMain.x+20, creepMain.y);
        creepwing.addChild(creepwingright);
        setInterval(() => {
            gsap.to(creepwingright
                ,{
                    rotation:Math.PI/18,
                    duration:0.1,
                    yoyo:true,
                    repeat:3,
                    repeatDelay:0,
                    ease: "sine.inOut",
                });
        }, 1000);
       
        creepContainer.addChild(creepwing);
        creepContainer.setChildIndex(creepwing,0);
        this.creeps.push(creepContainer);
        
    }
    startPlayerShooting(){
        if (!this.tutorial.parent) {
            const playerBaseGlobalPosition = this.playerbase.toGlobal(this.playershipbase.position);
            // console.log(playerBaseGlobalPosition);
            this.playerShoot(playerBaseGlobalPosition.x,playerBaseGlobalPosition.y-this.playershipbase.height/2);
            if(Game.sfx_music){
                sound.play("sfx_shoot",
                    {volume:0.1},
                );
            }
        }
    }
    startCreepShooting() {
            if (!this.tutorial.parent && !Game.gameover) {
                for (const creep of this.creeps) {
                    if (Math.random() < 0.001) {
                        if (creep==this.boss1) {
                            this.bossShoot(this.boss1.x, this.boss1.y + this.boss1.height / 2);
                        }else if(creep==this.boss2){
                            this.bossShoot(this.boss2.x, this.boss2.y + this.boss2.height / 2);
                        }
                        else{
                            const creepMain = creep.getChildAt(1);
                            const creepMainGlobalPosition = creep.toGlobal(creepMain.position);     
                            this.creepShoot(creepMainGlobalPosition.x, creepMainGlobalPosition.y+creepMain.height/2);
                        }
                        
                    }
                }
            }
    }
    
    drawPlayerBullet(){
        if(this.playerbase.visible){
            const playerbasebullet=Sprite.from(Texture.from("bullet_blue"));
            playerbasebullet.anchor.set(0.5, 0.5);
            playerbasebullet.scale.set(0.8);
            playerbasebullet.dmg=2;
            playerbasebullet.speed=-7;
            this.addChildAt(playerbasebullet,0);
            return playerbasebullet;
        }
        else{
            const playerupgradebullet=Sprite.from(Texture.from("bullet_green"));
            playerupgradebullet.anchor.set(0.5, 0.5);
            playerupgradebullet.scale.set(0.8);
            playerupgradebullet.dmg=4;
            playerupgradebullet.speed=-7;
            this.addChildAt(playerupgradebullet,0);
            return playerupgradebullet;
        }
    }
    drawBoss1(x,y){
        const bossImg=Sprite.from(Texture.from("spr_ginger_boy"));
        bossImg.anchor.set(0.5, 0.5);
        bossImg.scale.set(0.8);
        bossImg.position.set(x, y);
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
    drawBoss2(x,y){
        const bossImg=Sprite.from(Texture.from("spr_snow_creep"));
        bossImg.anchor.set(0.5, 0.5);
        bossImg.scale.set(0.8);
        bossImg.position.set(x, y);
        bossImg.hp=100;
        this.addChild(bossImg);
        this.creeps.push(bossImg);
        gsap.fromTo(
            bossImg,
            { y:0 },
            {
                y:GameConstants.screenHeight*0.25, 
                duration: 0.8, 
                ease: "power1.inOut",
            }
        );
        this.boss2=bossImg;
    }
    drawBoss1Bullet(){
        const bossbullet=Sprite.from(Texture.from("spr_candy_bullet"));
        bossbullet.anchor.set(0.5, 0.5);
        bossbullet.scale.set(0.8);
        this.addChildAt(bossbullet,0);
        return bossbullet;
    }
    drawBoss2Bullet(){
        const bossbullet=Sprite.from(Texture.from("spr_rocket_bullet"));
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
        if(this.boss1.parent){
            let bullet = this.drawBoss1Bullet();
            bullet.x = x;
            bullet.y = y;
            bullet.speed = 4;
            this.enemyBullets.push(bullet);
        }
        else if(this.boss2.parent){
            let bullet = this.drawBoss2Bullet();
            bullet.x = x;
            bullet.y = y;
            bullet.speed = 4;
            bullet.rotation=Math.PI;
            this.enemyBullets.push(bullet);
        }     
    }
    creepShoot(x, y) {
        let bullet = this.drawCreepBullet();
        bullet.x = x;
        bullet.y = y;
        bullet.speed = 4;
        this.enemyBullets.push(bullet);
    }
    playerShoot(x, y) {
        if (this.bulletCount > 6) this.bulletCount = 6;
        if (this.playerbase.visible) {  // đạn xanh
            for (let i = - (this.bulletCount - 1) / 2; i <= (this.bulletCount - 1) / 2; i++) {
                let bullet = this.drawPlayerBullet();
                bullet.x = x;
                bullet.y = y;
                gsap.fromTo(bullet, { x: bullet.x, y: bullet.y }, { x: x + 25 * i, y: y + Math.abs(25 * i), duration: 0.25 });
                this.playerBullets.push(bullet)
            }
        }
        else {
            for (let i = - (this.bulletCount - 1) / 2; i <= (this.bulletCount - 1) / 2; i++) {
                let bullet = this.drawPlayerBullet();
                bullet.x = x + 25 * i;
                bullet.y = y + Math.abs(20 * i);
                bullet.rotation = 10 * (Math.PI / 180) * i;
                this.playerBullets.push(bullet);
            }
        }
    }
    updateBullets() {
        if (this.playerbase.visible)
            for (let i = 0; i < this.playerBullets.length; i++) {
                const bullet = this.playerBullets[i];
                bullet.y += bullet.speed;
                if (bullet.y < 0) {
                    this.removeBullet(bullet, i);
                }
            }
        else {
            for (let i = 0; i < this.playerBullets.length; i++) {
                const bullet = this.playerBullets[i];
                bullet.y += bullet.speed;
                bullet.x += bullet.rotation / (Math.PI / 18) * .5;
                if (bullet.y < 0) {
                    this.removeBullet(bullet, i);
                }
            }
        }
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const bullet = this.enemyBullets[i];
            bullet.y += bullet.speed;
            if (bullet.y >= GameConstants.screenHeight) {
                this.removeBullet(bullet, i, false);
            }
        }
    }
    updatebooster(){
        if(this.powerup){
            this.powerup.y+=2;
        }
        for (let i = 0; i < this.bulletlvlupArray.length; i++) {
            const lvlup = this.bulletlvlupArray[i];
            lvlup.y += 2;
        }
    }
    updateCreep3(){
        const speed=2;
        for (let i = 0; i < this.creeps.length; i++) {
            const creep = this.creeps[i];
            creep.y += speed;
        
            if (creep.y > GameConstants.screenHeight + creep.height / 2) {
            this.removeChild(creep);
              this.creeps.splice(i, 1);
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
    updateLivesText() {
        this.livesText.text = `Remaining lives: ${this.lives}`;
    }
    updatePointText() {
        this.pointText.text = `Points: ${this.point}`;
    }
    secondWaveText(){
        const container = new Container(); 
        var text= Sprite.from(Texture.from("txt_wave2"));
        text.anchor.set(0.5, 0.5);
        text.scale.set(1);
        text.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.5);
        container.addChild(text);
        var glow= Sprite.from(Texture.from("spr_rect_glow"));
        glow.anchor.set(0.5, 0.5);
        glow.scale.set(1);
        glow.position.set(GameConstants.screenWidth*0.4, GameConstants.screenHeight*0.525);
        container.addChild(glow);
        gsap.fromTo(container,
            {
                x:-GameConstants.screenWidth*0.5,
            },
            {
                x:0,
                duration:1,
                repeat:0,
                ease: "power1.inOut",
            });
        setTimeout(() => {
            gsap.fromTo(container,
                {
                    x: 0,
                },
                {
                    x: GameConstants.screenWidth * 0.7,
                    duration: 1,
                    repeat: 0,
                    ease: "power1.inOut",
                });
        }, 1500 );
        setTimeout(() => {
            this.startSecondWave();
        }, 1000 );
        this.addChild(container);
    }
    thirdWaveText(){
        const container = new Container(); 
        var text= Sprite.from(Texture.from("txt_wave3"));
        text.anchor.set(0.5, 0.5);
        text.scale.set(1);
        text.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.5);
        container.addChild(text);
        var glow= Sprite.from(Texture.from("spr_rect_glow"));
        glow.anchor.set(0.5, 0.5);
        glow.scale.set(1);
        glow.position.set(GameConstants.screenWidth*0.4, GameConstants.screenHeight*0.525);
        container.addChild(glow);
        gsap.fromTo(container,
            {
                x:-GameConstants.screenWidth*0.5,
            },
            {
                x:0,
                duration:1,
                repeat:0,
                ease: "power1.inOut",
            });
        setTimeout(() => {
            gsap.fromTo(container,
                {
                    x: 0,
                },
                {
                    x: GameConstants.screenWidth * 0.7,
                    duration: 1,
                    repeat: 0,
                    ease: "power1.inOut",
                });
        }, 1500 );
        setTimeout(() => {
            this.startThirdWave();
        }, 1000 );
        this.addChild(container);
    }
    startSecondWave(){
        this.drawBoss2(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.25);
        this.drawCreep2(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.15);
        this.drawCreep2(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.15);
        this.drawCreep2(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.15);
        this.drawCreep2(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.15);
        this.drawCreep2(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.15);
        this.drawCreep2(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.25);
        this.drawCreep2(GameConstants.screenWidth*0.6,GameConstants.screenHeight*0.4);
        this.drawCreep2(GameConstants.screenWidth*0.55,GameConstants.screenHeight*0.4);
        this.drawCreep2(GameConstants.screenWidth*0.5,GameConstants.screenHeight*0.4);
        this.drawCreep2(GameConstants.screenWidth*0.45,GameConstants.screenHeight*0.4);
        this.drawCreep2(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.4);
        this.drawCreep2(GameConstants.screenWidth*0.4,GameConstants.screenHeight*0.25);
        for (let i = 1; i < 7; i++) {
            var container = this.creeps[i];
            gsap.timeline()
            .to(container,
            {
                x:container.x+185,  
                duration: 1,
                repeat: 0,
                ease: "power1.inOut",
            })
            .to(container,
            {
                x:container.x,  
                duration: 1,
                repeat: 0,
                ease: "power1.inOut",
            })
        }
        for (let i = 7; i < this.creeps.length; i++) {
            var container = this.creeps[i];
            gsap.timeline()
            .to(container,
            {
                x:container.x-185,  
                duration: 1,
                repeat: 0,
                ease: "power1.inOut",
            })
            .to(container,
            {
                x:container.x,  
                duration: 1,
                repeat: 0,
                ease: "power1.inOut",
            })
           
        }
    }
    startThirdWave(){
        this.spawnInterval = setInterval(() => {
            let spawnCount = 2;
            if (this.point > 50 && this.point <= 100) {
              spawnCount = 3;
            } else if (this.point > 100) {
              spawnCount = 4;
            }
            if (this.point!=0 && this.point % 50 == 0) {
                if(Math.random()<=0.5){
                    this.drawBoss1(Math.random() * GameConstants.screenWidth,30);
                }else{
                    this.drawBoss2(Math.random() * GameConstants.screenWidth,30);
                }
                this.point++;
                
            //   clearInterval(this.spawnInterval); 
             
            }
            this.spawnEnemyShips(spawnCount);
          }, 2000);
    }
    spawnEnemyShips(count) {
        if (Game.gameover) {
          return; 
        }
        for (let i = 0; i < count; i++) {
          this.drawCreep3(Math.random() * GameConstants.screenWidth,30);
        }
      }
    reset(){
        this.removeChild(this.player);
        this.creeps.forEach((creep) => this.removeChild(creep));
        this.creeps = [];
        this.lives = 3;
        this.point=0;
        Game.wave=1;
        clearInterval(this.shootingInterval);
        clearInterval(this.circleSpawnInterval);
        this.removeChild(this.powerup);
        this.removeChild(this.livesText);
        this.removeChild(this.pointText);
        this.removeChild(this.pausebtn);
        Game.is_upgrade=false;
        clearInterval(this.spawnInterval);
        this.bulletCount = 2;
        
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const playerBullet = this.playerBullets[i];
            if (playerBullet) {
              this.removeBullet(playerBullet, i);
            }
          }
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const enemyBullet = this.enemyBullets[i];
            if (enemyBullet) {
              this.removeBullet(enemyBullet, i, false);
            }
        }
        this.enemyBullets = [];
        this.bulletlvlupArray.forEach((lvlup) => this.removeChild(lvlup));
        this.playerBullets = [];
        this.bulletlvlupArray = [];
        this.isInvincible = false;
        this.startGame();

    }
    drawPauseButton(){
        this.pausebtn= Sprite.from(Texture.from("pause"));
        this.pausebtn.anchor.set(0.5, 0.5);
        this.pausebtn.scale.set(1);
        this.pausebtn.position.set(GameConstants.screenWidth*0.97,GameConstants.screenHeight*0.05);
        this.pausebtn.eventMode="static";
        this.pausebtn.on("pointerdown", () => 
        {
            Game.gameover=true;
            Game.app.stage.off("mousemove");
            Game.pause();
        });
        this.addChild(this.pausebtn);
    }
}