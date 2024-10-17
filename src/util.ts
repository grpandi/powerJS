import jszip from 'jszip'
import * as fs from "fs";

export function sayHellow(){
    console.log("TS Test")
}

export type shapeProps={
    id:string,
    

}

export function getNested(obj:object|any, ...args: string[]):any{
    return args.reduce((obj, level) => obj && obj[level], obj)
  }
