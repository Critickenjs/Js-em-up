export default class Game{
	constructor() {
        this.players = [];  //{"id":'',"posX":x,"posY:y","pseudo":'bob'}
        this.ennemys = [];  //{"posX":x,"posY:y","type":'red'}
        this.powers = [];  //{"posX":x,"posY:y","type":'life'}   
        this.shots = [];  //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false} 
        this.wavesNumber=1;
	}

    updatePlayersAndPlayerShots(map){
        this.players=[];
        this.shots=[];
        const iterator = map.entries();
    
        let entry;
        for(let i=0; i<map.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                const player = entry.value[1];
                this.players.push({"id":entry.value[0],"posX":player.posX,"posY":player.posY});
                for(let i=0; i<player.shots.length;i++){
                    this.shots.push({"posX":player.shots[i].posX,"posY":player.shots[i].posY,"isFromAPlayer":true,"perforation":player.shots[i].perforation});
                }
            }
        }
    }
}
