import { Application, Sprite, Text, Texture, TilingSprite, Assets, Graphics, Container} from "pixi.js";
import { sound } from "@pixi/sound";
import { manifest } from "./Manifest/manifest";
import {SceneManager} from './Scene/SceneManager'
import { GameConstants } from "./GameConstants/GameConstants";

export class Game {
  static init() {
    this.app = new Application({
      width: GameConstants.screenWidth,
      height: GameConstants.screenHeight,
      backgroundColor: 0x111111,
    });
    document.body.appendChild(this.app.view);
    this.music = true;
    this.sfx_music=true;
    this.processBar();
    this.loadGame().then(() => {
      this.app.stage.removeChild(this.loaderBar);
      var background= Texture.from('bg');
      const tilingSprite = new TilingSprite(background, GameConstants.screenWidth, GameConstants.screenWidth);
      tilingSprite.tileScale.set(3, 3);
      this.app.stage.addChild(tilingSprite);
      Game.app.ticker.add(() => {
        tilingSprite.tilePosition.y += 1;
      });
      sound.play("music_bg",{
        volume: 1,
        loop: true
      });
      this.SceneManager = new SceneManager();
      this.app.stage.addChild(this.SceneManager.stUI);
    }); 
  }
  static processBar(){
    this.loaderBarFill = new Graphics();
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, 100, 50);
    this.loaderBarFill.endFill();
    this.loaderBarFill.scale.x = 0; 
    this.loaderBarBoder = new Graphics();
    this.loaderBarBoder.lineStyle(10, 0x0, 1);
    this.loaderBarBoder.drawRect(0, 0, 100, 50);
    this.loaderBar = new Container();
    this.loaderBar.addChild(this.loaderBarFill);
    this.loaderBar.addChild(this.loaderBarBoder);
    this.loaderBar.position.x = (GameConstants.screenWidth - this.loaderBar.width) / 2; 
    this.loaderBar.position.y = (GameConstants.screenHeight - this.loaderBar.height) / 2;
    this.app.stage.addChild(this.loaderBar);
  }
  static async loadGame(){
    await Assets.init({manifest: manifest});
    const bundleIDs = manifest.bundles.map(bundle => bundle.name);
    await Assets.loadBundle(bundleIDs, this.loading.bind(this));
  }
  static loading(ratio){
      this.loaderBarFill.scale.x = ratio;
  }
  static play(){
    this.app.stage.removeChild(this.SceneManager.stUI);
    this.startGame();
  }
  static startGame(){
    this.app.stage.addChild(this.SceneManager.igUI);
    
  }
}

window.onload = function () {
  Game.init();
};
