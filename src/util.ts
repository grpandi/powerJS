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

export function getbyPath(obj:Object,path:string):Object|null{
    let pathArr = path.split('/');
    let result:any = obj;
    if (!result.hasOwnProperty('elements')) {
        return null;
    }
    for (let i = 0; i < pathArr.length; i++) {
      let element = pathArr[i];
      for (let j = 0; j < result['elements'].length; j++) {          
        if (result['elements'][j]['name'] == element) {
        // check if the element is found then assign the result to the element
          result = result['elements'][j];
        // if the path is end then send the result
          if(i == pathArr.length-1){
            return result;
          }
        //   if there is no futher element then return null
          if(!result['elements']){
            return null;
          }
          break;
        }
      }
    }
    return null;
  }




