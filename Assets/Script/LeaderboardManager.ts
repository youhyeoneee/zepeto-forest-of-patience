import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRangeRankResponse, LeaderboardAPI, ResetRule } from "ZEPETO.Script.Leaderboard";
import { GameObject, Transform } from "UnityEngine";
import Group from './Group'
import {Room} from "ZEPETO.Multiplay";
import ClientStarterV2 from './ClientStarterV2';

export default class LeaderboardManager extends ZepetoScriptBehaviour {

    public leaderboardId: string;
    public resetRule: ResetRule;
    private startRank: number = 1;
    private endRank: number = 10000; // Ranking information can be processed up to 10,000 cases at a time
    private myBestScore: number;
    private room : Room;

    @SerializeField() private myScoreGroup: GameObject;
    @SerializeField() private contentsParent: GameObject;
    @SerializeField() private groupPrefab: GameObject;

    Awake(){
        this.LoadLeaderboard();
        this.gameObject.SetActive(false);
    }

    Start(){
        ClientStarterV2.instance.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
            this.room.AddMessageHandler("ChangedScore", (message:number) => {
                this.StartCoroutine(this.ChangedScore(message));
            });
        };
    }
    OnEnable(){
        this.LoadLeaderboard();
    }

    OnDisable(){
        console.log(">> disable")
        this.UnLoadLeaderboard();
    }
 
    *ChangedScore(score: number){
        
    }
    
    public SendScore(score: number){
        this.myBestScore = (score < this.myBestScore || this.myBestScore == 0)? score : this.myBestScore;
        LeaderboardAPI.SetScore(this.leaderboardId, score, 
            (result)=>{console.log(`result.isSuccess: ${result.isSuccess}`);},
            (error)=>{console.error(error);});
        
        return this.myBestScore;
    }

    LoadLeaderboard(){
        LeaderboardAPI.GetRangeRank(this.leaderboardId, this.startRank, this.endRank, this.resetRule ,false ,
            (result)=>{this.OnResult(result);},
            (error)=>{console.error(error);}
        );
    }

    OnResult(result: GetRangeRankResponse) {
        if (result.rankInfo.myRank) {
            // Set Group - My Score
            var myRank = result.rankInfo.myRank;
            const _group : Group = this.myScoreGroup.GetComponent<Group>();
            this.myBestScore = myRank.score;
            _group.SetGroup(myRank.member, myRank.name, myRank.rank, myRank.score);
        }

        if (result.rankInfo.rankList) {
            var end = (result.rankInfo.rankList.length < this.endRank)? result.rankInfo.rankList.length : this.endRank;
            for (let i = 0; i < end; ++i) {
                var rank = result.rankInfo.rankList[i];
                // Set Groups - All Rankings
                var newGroup : GameObject = GameObject.Instantiate(this.groupPrefab, this.contentsParent.transform) as GameObject;
                const _group : Group = newGroup.GetComponent<Group>();
                _group.SetGroup(rank.member, rank.name, rank.rank, rank.score);
            }
        }
        
    }

    UnLoadLeaderboard(){
        this.contentsParent.GetComponentsInChildren<Group>().forEach((child)=>{
                GameObject.Destroy(child.gameObject);
            }
        )
    }

}