import { Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import { GameConstants } from "../GameConstants/GameConstants";
import { sound } from "@pixi/sound";

export class MusicButton extends Sprite{
    constructor(x, y){
        super();
        this.bgmusic = Sprite.from(Texture.from("ic_music"));
        this.bgmusic.anchor.set(0.5, 0.5);
        this.bgmusic.scale.set(0.1);
        this.bgmusic.position.set(x, y);
        this.bgmusic.eventMode = "static";
        this.bgmusic.on("pointerup",() => {
            if(Game.sfx_music){
                sound.play("sfx_pick_box",
                    {volume:0.1},
                );
            }
            Game.music = !Game.music;
            console.log("Music " + Game.music);
            if(Game.music) {
                if(sound.find("music_bg")){
                    sound.find("music_bg").volume = 1;        
                    this.bgmusic.tint = 0xffffff;
                    sound.volumeAll
                }
                else{
                    console.log("Music failed to start");
                }              
            } else {
                sound.find("music_bg").volume = 0;
                this.bgmusic.tint = 0x444444;
            }
        });
        this.bgmusic.on("pointerover", () => {
            this.bgmusic.scale.set(0.12); // Enlarge the button
          });
      
        this.bgmusic.on("pointerout", () => {
            this.bgmusic.scale.set(0.1); // Reset the scale back to the original
          });
        this.addChild(this.bgmusic);
    }
    listen(){
        if(Game.music) {
            this.bgmusic.tint = 0xffffff;
        } else {
            this.bgmusic.tint = 0x444444;
        }
    }
}

export class SFXButton extends Sprite {
    constructor(x, y) {
        super();
        this.sfxButton = Sprite.from(Texture.from("ic_sfx_music")); 
        this.sfxButton.anchor.set(0.5, 0.5);
        this.sfxButton.scale.set(0.05);
        this.sfxButton.position.set(x, y);
        this.sfxButton.eventMode = "static";
        this.sfxButton.on("pointerup", () => {
            Game.sfx_music = !Game.sfx_music;
            console.log("SFX muted: " + Game.sfx_music);
            if (Game.sfx_music) {
                this.sfxButton.tint = 0xffffff;
            } else {
                this.sfxButton.tint = 0x444444;
            }
        });
        this.sfxButton.on("pointerover", () => {
            this.sfxButton.scale.set(0.06); // Enlarge the button
          });
      
        this.sfxButton.on("pointerout", () => {
            this.sfxButton.scale.set(0.05); // Reset the scale back to the original
          });
        this.addChild(this.sfxButton);
    }
    listen() {
        if (Game.sfx_music) {
            this.sfxButton.tint = 0xffffff;
        } else {
            this.sfxButton.tint = 0x444444;
        }
    }
}