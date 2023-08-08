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
        this.addChild(this.tutorial);
        this.addChild(this.player);
        this.player.addChild(this.playerbase);
        this.player.addChild(this.playerupgrade);
        //test
        this.playerupgrade.visible=false;
        this.playerbase.visible=true;
        this.drawPowerup();
        //

        this.drawPlayerShip();  
        // test
        Ticker.shared.add(() => {
            if (!Game.gamestart) {
                this.checkCollision();
                this.checkUpgrade();
            }
        });
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
            if(Game.sfx_music){
                sound.play("sfx_booster_collected",
                    {volume:0.1},
                );
            };
            this.removeChild(this.powerup);
        }
    }
    checkUpgrade(){
        if(Game.is_upgrade){
            this.playerupgrade.visible=true;
            this.playerbase.visible=false;
        }
    }
    onStageClick(e) {
        Game.clickCount++;
        const oldX = e.data.global.x;
        const oldY = e.data.global.y;
        var playerX = this.player.x;
        var playerY = this.player.y;
        var dx = oldX - playerX;
        var dy = oldY - playerY; 
        if (Game.playbutton_clicked&&this.tutorial.parent&&Game.clickCount==2) {
            this.removeChild(this.tutorial);
            Game.app.stage.on("mousemove", (e) => {
                var newX = e.data.global.x;
                var newY = e.data.global.y; 
                var moveX=newX-dx;
                var moveY=newY-dy;
                
                if (moveX<=-(GameConstants.screenWidth/2-this.playershipbase.width/2)){
                    dx=newX-this.player.x;
                    moveX=-GameConstants.screenWidth/2+this.playershipbase.width/2;                  
                }
                if (moveX>=GameConstants.screenWidth/2-this.playershipbase.width/2){
                    dx=newX-this.player.x;
                    moveX=GameConstants.screenWidth/2-this.playershipbase.width/2;                  
                }
                if (moveY<=-(GameConstants.screenHeight*0.8-this.playershipbase.height/2)){
                    dy=newY-this.player.y;
                    moveY=-GameConstants.screenHeight*0.8+this.playershipbase.height/2;                  
                }
                if (moveY>=GameConstants.screenHeight*0.2-this.playershipbase.height/2){
                    dy=newY-this.player.y;
                    moveY=GameConstants.screenHeight*0.2-this.playershipbase.height/2;                  
                }
                gsap.to(this.player, {
                    x: moveX,
                    y: moveY,
                    duration: 0.2,
                });
              });
        }
    }
}