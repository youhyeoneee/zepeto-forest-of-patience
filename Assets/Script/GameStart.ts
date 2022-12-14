import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, GameObject, Quaternion, Vector3, WaitForSeconds} from "UnityEngine";
import {ZepetoCharacter, ZepetoPlayers} from "ZEPETO.Character.Controller";

export default class GameStart extends ZepetoScriptBehaviour {
    private localPlayerCharacter: GameObject;
    public timer: GameObject;

    private Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.localPlayerCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        });
    }


    private OnTriggerEnter(coll: Collider) {
        if (coll.gameObject != this.localPlayerCharacter) {
            return;
        }
                 
        if(!this.timer.activeSelf) {
            
            // 제자리로 이동
            this.StartCoroutine(this.RespawnCharacter(this.localPlayerCharacter));
            // 타이머 on
            this.timer.SetActive(true);
        }
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