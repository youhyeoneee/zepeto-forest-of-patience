import { GameObject, Mathf, Time } from 'UnityEngine';
import { Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Timer extends ZepetoScriptBehaviour {

    public time: float;
    public timer: GameObject;
    private flag = false;

    Start() {
        this.time = 0;
    }

    Update() {
        if(this.timer.activeSelf == true){
            if (!this.flag){ // 처음 한번만 초기화되도록
                this.time = 0;
                this.flag = true;
            }
            
            if(this.flag){
                this.time += Time.deltaTime;
                this.timer.GetComponent<Text>().text = Mathf.Round(this.time).toString();
            }   
        }
    }

    public SendResult(){
        var time = Mathf.Round(this.time);
        // 초기화 
        this.time = 0;
        this.flag = false;
        this.timer.SetActive(false);
        
        return time;
    }
}