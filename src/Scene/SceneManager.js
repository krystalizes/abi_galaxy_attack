import { Game } from "../game";
import { GameOverUI } from "../UI/GameOverUI";
import { InGameUI } from "../UI/InGameUI";
import { PauseUI } from "../UI/PauseUI";
import { StartUI } from "../UI/StartUI";

export class SceneManager{
    constructor(){
        this.stUI = new StartUI();
        this.igUI = new InGameUI();
        this.goUI = new GameOverUI();
        this.pUI = new PauseUI();
    }
    
}