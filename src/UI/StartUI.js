import { Container, Text, TextStyle, Texture,TilingSprite } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { MusicButton, SFXButton } from "./MusicButton";
export class StartUI extends Container{
    constructor(){
        super();
        this.drawTitle();
        this.drawPlayButton();
        this.drawMusicButton();
        this.drawSFXMusicButton();
    }
    drawTitle(){
        var title= Sprite.from(Texture.from("title"));
        title.anchor.set(0.5, 0.5);
        title.scale.set(2);
        title.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.1);
        this.addChild(title)
        gsap.fromTo(title,{
            y: GameConstants.screenHeight*0.2,           
        },{
            y: GameConstants.screenHeight*0.3,
            duration:1.5,
            yoyo:true,
            repeat:-1,
            repeatDelay:0,
            ease: "power1.inOut",
        });
    }
    drawPlayButton(){
        var playButton = Sprite.from(Texture.from("ic_play"));
        playButton.anchor.set(0.5, 0.5);
        playButton.scale.set(0.4);
        playButton.position.set(GameConstants.screenWidth*0.5, GameConstants.screenHeight*0.6);
        playButton.eventMode = "static";
        playButton.on("pointerup",() => {
            if(Game.sfx_music){
                sound.play("sfx_pick_box",
                    {volume:0.1},
                );
            }
            Game.play();
        });
        playButton.on("pointerover", () => {
            playButton.scale.set(0.5); 
        });
      
        playButton.on("pointerout", () => {
            playButton.scale.set(0.4); 
        });
        this.addChild(playButton);
    }
    drawMusicButton(){
        this.musicButton = new MusicButton(GameConstants.screenWidth*0.97, GameConstants.screenHeight*0.05);
        this.addChild(this.musicButton);
    }
    drawSFXMusicButton(){
        this.sfx_musicButton = new SFXButton(GameConstants.screenWidth*0.93, GameConstants.screenHeight*0.05);
        this.addChild(this.sfx_musicButton);
    }
}