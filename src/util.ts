import jszip from 'jszip'
import * as fs from "fs";
import { BGProps } from './interface';

export function sayHellow(){
    console.log("TS Test")
}

export type shapeProps={
    id:string,
    

}

export function getNested(obj:object|any, ...args: string[]):any{
    return args.reduce((obj, level) => obj && obj[level], obj)
  }
 export function getFillProps(obj:Object):Object{
    let ClrObj:any = {val:''}
    // NoFill.. no code needed
    


    // solidFill
    if('a:solidFill' in obj){
        ClrObj.val = getColor(obj['a:solidFill'])
    }


    // gradFill
    if('a:gradFill' in obj){
        ClrObj.val = {gradient:[], linang:''}
        let gradStopObj = getNested(obj, 'a:gradFill','a:gsLst','a:gs')
        for(let gs in gradStopObj){
            let clr = getColor(gradStopObj[gs])
            let gsPos = gradStopObj[gs]['@_pos']
            ClrObj.val.gradient.push({pos:gsPos, clr})
        }
        ClrObj.val.linang = parseInt(getNested(obj, 'a:gradFill','@_ang'))/10000        
    }




    // blipFill


    // pattFill


    return ClrObj

}

export function getColor(obj:any):any{

    let clr:any={type:'', val:''}
    // hslClr
    if("a:hslClr" in obj){
        let hsl={hue:0, saturation:0, lightness:0}
        let hslObj = obj['a:hslClr']
        if('@_hue'in hslObj){hsl.hue = parseInt(hslObj['@_hue'])/10000}
        if('@_sat'in hslObj){hsl.saturation = parseInt(hslObj['@_sat'])/100}
        if('@_lum'in hslObj){hsl.lightness =parseInt(hslObj['@_lum'])/100}
        if(hslObj['a:hue']in hslObj){hsl.hue = hslObj['a:hue']['@_val']}
        clr.type='hsl'
        clr.val = hsl
    }

    // prstClr
    if("a:prstClr" in obj){
        clr.type = 'Preset Color'
        clr.val = obj['a:prstClr']['@_val']
    }


    // schemeClr
    if("a:schemeClr" in obj){
        clr.type = 'Scheme Color'
        clr.val = obj['a:schemeClr']['@_val']
    }


    // scrgbClr
    if("a:scrgbClr" in obj){
        if(obj['a:scrgbClr']['@_r'] in obj['a:scrgbClr']){
            clr.type = 'rgb'
            clr.val={r:0, g:0, b:0}
            clr.val.r = Math.round(parseInt(obj['a:scrgbClr']['@_r'])/10000*255)
            clr.val.g = Math.round(parseInt(obj['a:scrgbClr']['@_g'])/10000*255)
            clr.val.b = Math.round(parseInt(obj['a:scrgbClr']['@_b'])/10000*255)
        }
        if(obj['a:scrgbClr']['@_val'] in obj['a:scrgbClr']){
            clr.type='hex'
            clr.val = '#' + obj['a:scrgbClr']['@_val']
        }
    
    }


    // srgbClr
    if("a:srgbClr" in obj){
        clr.type='hex or hexA'
        clr.val = '#' + obj['a:srgbClr']['@_val']   
    }


    // sysClr
    if('a:sysClr' in obj){
        clr.type='System Color'
        clr.val = obj['a:sysClr']['@_val'] 
    }


    return clr

}

export function getBG(bb:object):BGProps{
    let bg:BGProps = Object.create(bb)
    return bg
}
export var BG:any = BG({
    bg:'test',
    bgf: function(){return'true'}
})
