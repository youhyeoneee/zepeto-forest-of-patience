import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Mathf} from "UnityEngine";
import {Text} from "UnityEngine.UI";

export default class UIManager extends ZepetoScriptBehaviour {
    public resultUi: GameObject;
    public scoreText: Text;
    public bestScoreText: Text;
    
    public LoadResult(score: number, bestScore: number){
        // 결과창 띄우기
        this.resultUi.SetActive(true);
        this.scoreText.text = score.toString();
        this.bestScoreText.text = bestScore.toString();
    }
}