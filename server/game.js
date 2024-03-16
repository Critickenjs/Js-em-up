export default class Game{
	constructor() {
        this.players = [];  //{"id":'',"posX":x,"posY:y","pseudo":'bob'}
        this.ennemys = [];  //{"posX":x,"posY:y","type":'red'}
        this.powers = [];  //{"posX":x,"posY:y","type":'life'}   
        this.shots = [];  //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false} 
        this.wavesNumber=1;
	}

    updatePlayers(map){
        this.players=[];
        const iterator = map.entries();
    
        let entry;
        for(let i=0; i<map.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                this.players.push({"id":entry.value[0],"posX":entry.value[1].posX,"posY":entry.value[1].posY});
            }
        }
    }
}
