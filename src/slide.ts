import {getNested,getbyPath} from './util'
import {Shape} from './shape'
import { Fill,Color } from './style'



export class Slideex{

    private _slideRel:Rel | undefined
    private _masters:any
    private _layout:any
    private _slides:any
    private _theme:any
    private _slideObj:any
    num:number
    bg:Shape

    constructor(num:number){
        this.num=num
        this.bg= new Shape()
    }
    
    set slideobj(obj:Object){
        this._slideObj = obj;
    }
    set slideRel(obj:Object){
        this._slideRel= new Rel(obj)
    }
    set layout(obj:any){
        if(typeof(this._slideRel)!= 'undefined'){
            let layoutName:any = this._slideRel.getByType('slideLayout')
            if(layoutName.hasOwnProperty(0)){
                layoutName = layoutName[0].split('/').pop()
                this.layout = obj[layoutName];
            }
        }
    }

    
    set master(obj:any){

    }
    

    set slides(a:any){

    }

    set theme(a:any){

    }


    




}

export class Slides{
    private _slideObj:object
    private _slideRelobj:object

    constructor(obj:Object, rel:Object){
        this._slideObj = obj;
        this._slideRelobj = rel;
    }

    getSlide(slideNr:number):Slide{
        let slide = getNested(this._slideObj,'slide'+slideNr+'.xml')
        return slide
    }
    getSlideRel(slideNr:number){    
        let slideRel = getNested(this._slideRelobj,'slide'+slideNr+'.xml.rels')
        return slideRel
    }
    

}

export class Slide{
    private _slideObj:any
    bgShp:Shape|undefined
    private type = 'slide'
    clrMap:any
    master:Slide|undefined
    layout:Slide|undefined
    rel:Rel|undefined
    theme:any
    images:any={}
    width=0
    height=0
    shapes: Shape[]=[]

    constructor(){ 
        // if(obj){
        //     this._slideObj = obj;
        //     if(this._slideObj['elements'][0]['name']=='p:sldLayout'){this.type='layout'}
        //     if(this._slideObj['elements'][0]['name']=='p:sldMaster'){this.type='master'}
        // }     
        
    }

    set obj(obj:any){
        this._slideObj = obj
        if(this._slideObj['elements'][0]['name']=='p:sldLayout'){this.type='layout'}
        if(this._slideObj['elements'][0]['name']=='p:sldMaster'){this.type='master'}
        this.setClrMap()
        this.setShape()
        if(this.type=="slide") {
            this.setBG()
        } 
    }

    private setClrMap(){
        let clrMapObj:any =getbyPath(this._slideObj,this.topName() + '/p:clrMap')
        if(clrMapObj!=null){
            this.clrMap = clrMapObj['attributes']
        }else{
            if(this.type =='layout'){
                clrMapObj = getbyPath(this.master?._slideObj,'p:sldMaster/p:clrMap')
                if(clrMapObj!=null){
                    this.clrMap = clrMapObj['attributes']
                }
            }
            if(this.type =='slide'){
                clrMapObj = getbyPath(this.layout?._slideObj,'p:sldLayout/p:clrMap')
                if(clrMapObj!=null){
                    this.clrMap = clrMapObj['attributes']
                }else{
                    clrMapObj = getbyPath(this.layout?.master?._slideObj,'p:sldMaster/p:clrMap')
                    if(clrMapObj!=null){
                        this.clrMap = clrMapObj['attributes']
                    }
                }
            }
        }
    }

    private setBG(){
        
                   
        // 1. get BG
        let bg = this.getbgObj()
        let src = 'slide'
        if(bg==null){
            bg = this.layout?.getbgObj()
            src = 'layout'
        }
        if(bg==null){
            bg = this.layout?.master?.getbgObj()
            src = 'master'
        }
        this.bgShp= new Shape(0,0,this.width, this.height)
        this.bgShp.src = src
        this.bgShp.stroke.fill.fillType='noFill'
        if(bg['elements'][0]['name'] == 'p:bgPr'){ 
            this.bgShp.fill=new Fill(bg['elements'][0]['elements'][0], this.clrMap, this.theme)
        }
        if(bg['elements'][0]['name'] == 'p:bgRef'){
            // no fill object in bg Object, add color to fill object
            this.bgShp.fill.fillType="solidFill"
            let clrObj = bg['elements'][0]['elements'][0]
            let color=new Color(clrObj,this.clrMap,this.theme)
            this.bgShp.fill.fillVal =color.getColor()     
        }

    }

    private setShape(){
        // console.log(this._slideObj) 
        let path = 'p:sld/p:cSld/p:spTree' 
        if(this.type=='master') {path = 'p:sldMaster/p:cSld/p:spTree'}
        if(this.type=='layout') {path = 'p:sldLayout/p:cSld/p:spTree'}
        let shpes:any = getbyPath(this._slideObj,path)

        // Get Shapes
        if(shpes != null){
            for (let sp of shpes['elements']){
                if(sp['name']=='p:sp'){
                    this.readShape(sp)
                }
                if(sp['name']=='p:grpSp'){
                    // console.log(sp)
                }
                if(sp['name']=='p:pic'){
                    // console.log(sp)
                }
                // if(sp['name']=='a:graphicFrame'){}
                if(sp['name']=='p:cxnSp'){
                    // console.log(sp)
                }

            }

        }
        


    }

    private readShape(obj:any){
        // console.log(obj)
        let shp = new Shape()
        shp.slideReference = this
        shp.obj = obj
        let shpProp:any = getbyPath(obj,'p:sp/p:spPr')
        this.shapes.push(shp)
        
        // console.log(shp)

    }
    private readShpGrp(obj:any){}
    private readShpPic(obj:any){}
    private readShpCon(obj:any){}

    get cclrMap():any{
        // 'return if it has a clrMap'
        let clrMap:any =getbyPath(this._slideObj,this.topName() + '/p:clrMap')
        if(clrMap==null){return null}
        else{
            if(clrMap?.hasOwnProperty('attributes') ){
                return clrMap['attributes']
            } 
        }  
    }

    private topName(){
        let topName = ''
        if (this.type == 'master'){
            topName = 'p:sldMaster'
        }
        if (this.type == 'layout'){
            topName = 'p:sldLayout'
        }
        if (this.type == 'slide'){
            topName = 'p:sld'
        }
        return topName
    }

    hf(layoutName:string){
        return {}
    }
    timing(layoutName:string){
        return {}
    }
    transition(layoutName:string){
        return {}
    }

    getLayout(LayoutName:string){
        return {}
    }
    getRel(LayoutName:string){
        return {}
    }
    getbgObj(){
      let bg:any = getbyPath(this._slideObj,this.topName()+'/p:cSld/p:bg')
      return bg  
    }


    getShapeByName(ShapeName:String):Shape|undefined{
        for (let sp of this.shapes){
            if (sp.name == ShapeName){
                return sp
            }
        }
        return undefined
    }

    getShapeById(ShapeID:String): Shape | undefined {
        for (let sp of this.shapes){
            if (sp.id == ShapeID){
                return sp
            }
        }
        return undefined
    }


}

export class SlideMasters{
    private _slideMasterObj:any
    private _slideMasterRelobj:any
    private _slideMasterM:any
    private _slideMasterL:any
    private _slideMasterShapes:any

    constructor(obj:Object, rel:Object){
        this._slideMasterObj = obj;
        this._slideMasterRelobj = obj;
    }

}


export class Rel{

    relObj:Object

    constructor(relObj:Object){
        this.relObj=relObj
    }

    getByType(type:String):object{
        let res:any = {}
        let cnt = 0
        let relElements:any=getbyPath(this.relObj,'Relationships')
        if(relElements == null){return res}
        if (!relElements.hasOwnProperty('elements')){return res;}
        for (let i of relElements['elements']) {
        let relType = i['attributes']['Type'].split('/').pop()
        if(relType == type){
            res[cnt] = i['attributes'];
            cnt++;
            }        
        }
        return res
    }
    getById(id:String):string{
        let res = ''
        let relElements:any=getbyPath(this.relObj,'Relationships')
        if(relElements == null){return res}
        if (!relElements.hasOwnProperty('elements')){return res;}
        for (let i of relElements['elements']) {
        let relType = i['attributes']['Id']
        if(relType == id){
            res= i['attributes']['Target'];
            return res;
            }        
        }

        return res
    }

}



