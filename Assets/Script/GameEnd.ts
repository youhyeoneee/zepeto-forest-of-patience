import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoCharacter, ZepetoPlayers} from "ZEPETO.Character.Controller";
import {Collider, GameObject, Quaternion, Vector3, WaitForSeconds} from "UnityEngine";
import { Button } from 'UnityEngine.UI';
import Timer from './Timer';
import UIManager from './UIManager';
import LeaderboardManager from './LeaderboardManager';

export default class GameEnd extends ZepetoScriptBehaviour {

    @SerializeField() private OkButton: Button;
    @SerializeField() private timer: GameObject;
    @SerializeField() private uiManager: GameObject;
    @SerializeField() private leaderboardManager: GameObject;

    private localPlayerCharacter: GameObject;

    private Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.localPlayerCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        });
    }

    private OnTriggerEnter(coll: Collider) {
        if (coll.gameObject != this.localPlayerCharacter) {
            return;
        }
        
        // 도착하면 결과 전송 및 결과창 띄우기
        var score = this.timer.GetComponent<Timer>().SendResult();
        var bestScore = this.leaderboardManager.transform.Find("LeaderboardPanel").GetComponent<LeaderboardManager>().SendScore(score);
        this.uiManager.GetComponent<UIManager>().LoadResult(score, bestScore);

        this.OkButton.onClick.AddListener(() => this.StartCoroutine(this.RespawnCharacter(this.localPlayerCharacter)))

    }
    
    private *RespawnCharacter(obj: GameObject) {
        let character = obj.GetComponent<ZepetoCharacter>();
        while (true) {
            if (obj.transform.position != Vector3.zero) {
                character.Teleport(Vector3.zero, Quaternion.identity);
                if (obj.transform.position.y > -1)
                    break;
            }
            yield new WaitForSeconds(0.3);
        }
    }
}