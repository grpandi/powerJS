import { BGProps, BGtype } from './interface';

export function sayHellow(){
    console.log("TS Test")
}

export type shapeProps={
    id:string,
    

}

export function getNested(obj:object|any, ...args: string[]):any{
    return args.reduce((obj, level) => obj && obj[level], obj)
  }

export function getBG(bb:object):BGProps{
    let bg:BGProps = Object.create(bb)
    return bg
}



