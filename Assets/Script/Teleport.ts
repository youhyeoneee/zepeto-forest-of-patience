import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Quaternion, Collider, Vector3, WaitForSeconds, WaitUntil } from 'UnityEngine'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import {Room} from "ZEPETO.Multiplay";
import ClientStarterV2 from './ClientStarterV2';

export default class Teleport extends ZepetoScriptBehaviour {
    private room : Room;

    Start() {
        ClientStarterV2.instance.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
            this.room.AddMessageHandler("ReSpawn", (message:string) => {
                this.StartCoroutine(this.ReSpawn(message.toString()));
            });
        };
    }

    private OnTriggerEnter(coll: Collider) {
        if(coll.transform.name == this.room.SessionId)
            this.room.Send("ReSpawn");
    }

    private *ReSpawn(sessionId:string){
        console.log(sessionId);
        yield new WaitUntil(()=>ZepetoPlayers.instance.HasPlayer(sessionId));
        const player = ZepetoPlayers.instance.GetPlayer(sessionId);
        console.log(player);
        player.character.Teleport(Vector3.zero,Quaternion.Euler(Vector3.zero));
    }

}