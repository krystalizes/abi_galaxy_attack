import { Container, Text, TextStyle, Texture,TilingSprite } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/Gameconstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
export class StartUI extends Container{
    constructor(){
        super();
        this.drawBackground();
      
    }
    drawBackground(){
        var background= Texture.from('bg');
        const tilingSprite = new TilingSprite(background, GameConstants.screenWidth, GameConstants.screenHeight);
        tilingSprite.tileScale.set(3, 3);
        this.addChild(tilingSprite);
        Game.app.ticker.add(() => {
          tilingSprite.tilePosition.y += 1;
        });
    }
}