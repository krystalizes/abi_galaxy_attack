import { Container, Text, TextStyle, Texture,Ticker,TilingSprite,Graphics } from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";
export class CollisionHandler{
    constructor(){

    }
    static detectCollision(obj1, obj2) {
        const obj1Bounds = obj1.getBounds();
        const obj2Bounds = obj2.getBounds();
        return (
        obj1Bounds.x + obj1Bounds.width > obj2Bounds.x + obj1Bounds.width/2 &&
        obj1Bounds.x + obj1Bounds.width/2 < obj2Bounds.x + obj2Bounds.width &&
        obj1Bounds.y + obj1Bounds.height > obj2Bounds.y + obj1Bounds.height/2 &&
        obj1Bounds.y + obj1Bounds.height/2 < obj2Bounds.y + obj2Bounds.height
        );
    }
}
