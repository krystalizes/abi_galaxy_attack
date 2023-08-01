import { Game } from "../game";
import { InGameUI } from "../UI/InGameUI";

import { StartUI } from "../UI/StartUI";

export class SceneManager{
    constructor(){
        this.stUI = new StartUI();
        this.igUI = new InGameUI();
    }
    
}