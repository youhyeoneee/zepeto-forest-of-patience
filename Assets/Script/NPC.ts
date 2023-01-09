import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter, ZepetoCharacterCreator, ZepetoCamera } from 'ZEPETO.Character.Controller'
import { WorldService } from 'ZEPETO.World';

export default class NPC extends ZepetoScriptBehaviour {
    public playerId : string = "dbgus0311";

    Start() {
        // 제페토 플레이어 인스턴스를 이용해 NPC 생성
        ZepetoPlayers.instance.CreatePlayerWithZepetoId(this.playerId, this.playerId, new SpawnInfo(), true);
        
        const target = ZepetoPlayers.instance.GetPlayer(this.playerId);
        console.log(">> TARGET : ", target)
        target.character.MoveToPosition(this.transform.position);
    }
}    