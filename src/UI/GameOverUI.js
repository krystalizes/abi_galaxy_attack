import { Container, Sprite, Text, TextStyle, Texture, Graphics } from "pixi.js";
import { GameConstants } from "../GameConstants/GameConstants";
import { Game } from "../game";
import { sound } from "@pixi/sound";

export class GameOverUI extends Container {
    constructor() {
        super();
        this.showGameOverScreen();
    }
    showGameOverScreen() {
        const gameOverScreen = new Graphics();
        gameOverScreen.beginFill(0x000000, 0.5);
        gameOverScreen.drawRect(0, 0, GameConstants.screenWidth, GameConstants.screenHeight);
        gameOverScreen.endFill();
    
        const gameOverText = new Text("Game Over", new TextStyle({
          fill: 0xffffff,
          fontSize: 48,
          fontWeight: "bold",
        }));
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(GameConstants.screenWidth / 2, GameConstants.screenHeight / 2 - 50);
        gameOverScreen.addChild(gameOverText);

        const playAgainButton = new Text("Play Again", new TextStyle({
          fill: 0xffffff,
          fontSize: 24,
          fontWeight: "bold",
          padding: 10,
          backgroundColor: 0x3366ff,
        }));
        playAgainButton.anchor.set(0.5);
        playAgainButton.position.set(GameConstants.screenWidth/ 2, GameConstants.screenHeight / 2 + 80);
        playAgainButton.eventMode = "static";
        playAgainButton.on("pointerdown", () => {
          Game.replay();
          console.log(Game.clickCount);
        });
        gameOverScreen.addChild(playAgainButton);
        this.addChild(gameOverScreen);
      }
}