import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Image, Text } from 'UnityEngine.UI'
import { Texture, Texture2D, Sprite, Rect, Vector2, GameObject } from 'UnityEngine'
import { ZepetoWorldHelper, Users } from 'ZEPETO.World'

export default class Group extends ZepetoScriptBehaviour {

    @SerializeField() private playerImage: Image;
    @SerializeField() private playerRankText: Text;
    @SerializeField() private playerNameText: Text;
    @SerializeField() private playerScoreText: Text;

    public SetGroup(userId: string, name: string, rank: number, score: number){
        // Set player's Image
        ZepetoWorldHelper.GetProfileTexture(userId,(texture:Texture)=>{
            this.playerImage.sprite = this.GetSprite(texture);
        },(error)=>{
            console.log(error);
        });

        // Set player's name, rank, and score
        this.playerNameText.text = name;
        this.playerRankText.text = rank.toString();
        this.playerScoreText.text = score.toString();
    }

    GetSprite(texture:Texture){
        let rect:Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }

}