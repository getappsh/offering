import { OS, Formation } from "@app/common/database/entities"
import { IsNotEmpty, IsString } from "class-validator"

class PackageMessage {
    OS: OS
    formation: Formation
    fromVersion: string
    toVersion: string
  
    constructor(OS: OS,  formation :Formation, fromVersion: string, toVersion: string ){
      this.OS = OS;
      this.formation = formation;
      this.fromVersion = fromVersion;
      this.toVersion = toVersion;
    }
  }
export class PackageMessageDto{

    @IsString()
    @IsNotEmpty()
    OS: OS

    @IsString()
    @IsNotEmpty()
    formation: string

    // @IsValidStringFor("version")
    @IsNotEmpty()
    fromVersion: string
    
    // @IsValidStringFor("version")
    @IsNotEmpty()
    toVersion: string
  
    constructor(OS: OS,  formation :string, fromVersion: string, toVersion: string ){
      this.OS = OS;
      this.formation = formation;
      this.fromVersion = fromVersion;
      this.toVersion = toVersion;
    }
    

    toString(){
        return JSON.stringify(this)
    }

}