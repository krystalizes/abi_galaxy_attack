import { Container, MASK_TYPES, Text, TextStyle, Texture,Ticker,TilingSprite,Graphics } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { MusicButton, SFXButton } from "./MusicButton";
export class InGameUI extends Container{
    constructor(){
        super();
        this.tutorial = new Container();
        this.player = new Container();
        this.addChild(this.tutorial);
        this.addChild(this.player);
        this.drawPlayerShip();  
        this.loopcircle();
        this.clickCount=0;
        this.tutorial.addChild(this.drawtext());
        this.tutorial.addChild(this.drawhand());
        Game.app.stage.on("click", this.onStageClick.bind(this));
    } 
    drawPlayerShip(){
        this.playership= Sprite.from(Texture.from("ship_blue_base"));
        this.playership.anchor.set(0.5, 0.5);
        this.playership.scale.set(0.5);
        this.playership.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.8);
        this.player.addChild(this.playership);
        this.smokeblue= Sprite.from(Texture.from("smoke_blue"));
        this.smokeblue.anchor.set(0.5, 0.5);
        this.smokeblue.scale.set(0.5);
        this.smokeblue.position.set(this.playership.x, this.playership.y+61);
        this.player.addChild(this.smokeblue);
        Ticker.shared.add(()=>{
            this.smokeblue.visible = !this.smokeblue.visible;
        },500);
        this.basewing=new Container();
        this.left= Sprite.from(Texture.from("spr_wing_ship_left"));
        this.left.anchor.set(1,0);
        this.left.scale.set(0.5);
        this.left.position.set(this.playership.x, this.playership.y+5);
        this.basewing.addChild(this.left);
        gsap.to(this.left
        ,{
            rotation:-Math.PI/18,
            duration:0.4,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "sine.inOut",
        });
        this.right= Sprite.from(Texture.from("spr_wing_ship_left"));
        this.right.anchor.set(1,0);
        this.right.scale.set(-0.5,0.5);
        this.right.position.set(this.playership.x, this.playership.y+5);
        this.basewing.addChild(this.right);
        gsap.to(this.right
            ,{
                rotation:Math.PI/18,
                duration:0.4,
                yoyo:true,
                repeat:-1,
                repeatDelay:0,
                ease: "sine.inOut",
            });
        this.player.addChild(this.basewing);
        this.player.setChildIndex(this.basewing,0);
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
    onStageClick(e) {
        this.clickCount++;
        const oldX = e.data.global.x;
        const oldY = e.data.global.y;
        const playerX = this.player.x;
        const playerY = this.player.y;
        console.log(playerX,playerY);
        const dx = oldX - playerX;
        const dy = oldY - playerY; 
        if (Game.playbutton_clicked&&this.tutorial.parent&&this.clickCount==2) {
            this.removeChild(this.tutorial);
            Game.app.stage.on("mousemove", (e) => {
                const newX = e.data.global.x;
                const newY = e.data.global.y; 
                const moveX=newX-dx;
                const moveY=newY-dy;
                
                if (moveX<playerX+GameConstants.screenWidth){
                    
                }
                this.player.x = moveX;
                console.log(moveX,moveY);
                this.player.y = moveY;
              });
        }
    }
}