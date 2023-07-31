import { Container, Text, TextStyle, Texture,TilingSprite } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
import { MusicButton } from "./MusicButton";
export class StartUI extends Container{
    constructor(){
        super();
        this.drawBackground();
        this.drawTitle();
        this.drawPlayButton();
        this.drawMusicbutton();
    }
    drawBackground(){
        var background= Texture.from('bg');
        const tilingSprite = new TilingSprite(background, GameConstants.screenWidth, GameConstants.screenWidth);
        tilingSprite.tileScale.set(3, 3);
        this.addChild(tilingSprite);
        Game.app.ticker.add(() => {
          tilingSprite.tilePosition.y += 1;
        });
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
        })
    }
    drawPlayButton(){

    }
    drawMusicbutton(){
        this.musicButton = new MusicButton(GameConstants.screenWidth*0.97, GameConstants.screenHeight*0.05);
        this.addChild(this.musicButton);
    }
}