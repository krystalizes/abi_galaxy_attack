import { Container, Sprite, Text, TextStyle, Texture, Graphics } from "pixi.js";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { MusicButton, SFXButton } from "./MusicButton";
import { sound } from "@pixi/sound";

export class PauseUI extends Container {
    constructor() {
        super();
        this.showPauseScreen();
        this.drawMusicButton();
        this.drawSFXMusicButton();
    }
    showPauseScreen() {
        const pauseScreen = new Graphics();
        pauseScreen.beginFill(0x000000, 0.5);
        pauseScreen.drawRect(0, 0, GameConstants.screenWidth, GameConstants.screenHeight);
        pauseScreen.endFill();
    
        const pauseText = new Text("GAME PAUSED", new TextStyle({
          fill: 0xffffff,
          fontSize: 48,
          fontWeight: "bold",
        }));
        pauseText.anchor.set(0.5);
        pauseText.position.set(GameConstants.screenWidth / 2, GameConstants.screenHeight / 2 - 50);
        pauseScreen.addChild(pauseText);


        const pausebtn= Sprite.from(Texture.from("pause"));
        pausebtn.anchor.set(0.5, 0.5);
        pausebtn.scale.set(1);
        pausebtn.position.set(GameConstants.screenWidth*0.97,GameConstants.screenHeight*0.05);
        pausebtn.eventMode="static";
        pausebtn.on("pointerdown", () => 
        {
            Game.gameover=false;
            Game.resume();
        });
        
        this.addChild(pauseScreen);
        this.addChild(pausebtn);
      }
    drawMusicButton(){
        this.musicButton = new MusicButton(GameConstants.screenWidth*0.9, GameConstants.screenHeight*0.05);
        this.addChild(this.musicButton);
    }
    drawSFXMusicButton(){
        this.sfx_musicButton = new SFXButton(GameConstants.screenWidth*0.93, GameConstants.screenHeight*0.05);
        this.addChild(this.sfx_musicButton);
    }
}