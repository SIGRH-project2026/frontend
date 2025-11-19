import { Avancement } from "./avancement";
import { Diplome } from "./diplome";
import { EtatCivil } from "./etatCivil";
import { SituationAdministrative } from "./situationAdministrative";
import { UserDTOs } from "src/app/models/UserDTOs";

export class DossierAgent{
    id : number=100
    diplomes : Diplome[] = []
    situationAdministrative : SituationAdministrative[] = []
    avancements : Avancement[]=[]
    utilisateur: UserDTOs= new UserDTOs();
    //situationMatrimoniale : string=""
}

export class DossierAgentDto{
    id : number=100
    diplomes : Diplome[] = []
    situationAdministrative : SituationAdministrative[] = []
    avancements : Avancement[]=[]
    utilisateurId!: number ;
    etatCivil : EtatCivil[] = []
   // situationMatrimoniale : string=""
}

