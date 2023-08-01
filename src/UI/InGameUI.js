import { Container, Text, TextStyle, Texture,Ticker,TilingSprite } from "pixi.js";
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
        this.addChild(this.tutorial);
        this.drawPlayerShip();  
        this.loopcircle();
        this.tutorial.addChild(this.drawtext());
        // this.tutorial.addChild(this.drawcircle());
        this.tutorial.addChild(this.drawhand());
        
    } 
    drawPlayerShip(){
        var playership= Sprite.from(Texture.from("ship_blue_base"));
        playership.anchor.set(0.5, 0.5);
        playership.scale.set(0.5);
        playership.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.8);
        playership.eventMode="dynamic";
        this.addChild(playership);
        var smokeblue= Sprite.from(Texture.from("smoke_blue"));
        smokeblue.anchor.set(0.5, 0.5);
        smokeblue.scale.set(0.5);
        smokeblue.position.set(GameConstants.screenWidth*0.5, playership.y+61);
        smokeblue.eventMode="dynamic";
        this.addChild(smokeblue);
        Ticker.shared.add(()=>{
            smokeblue.visible = !smokeblue.visible;
        },500);
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
            this.tutorial.addChild(this.drawcircle());
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
        //only create 1 circle at a time
        // gsap.to(circle.scale, {
        //     x:0.1,y:0.1, duration: 1, repeat: -1, 
        // });
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
}