import { config } from "./config";

export function getFolder(folder:string,id:string){
  return `${config.folderPath}/${folder}/${id}`
}
