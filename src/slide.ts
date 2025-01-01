import {getNested,getbyPath} from './util'
import {Shape} from './shape'
import { get } from 'http'

export class SlideOld  {
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
     slidenr:number = 1
    protected _slideObj:any ={}
    protected _slideRel:any={}
    protected _slideM:any = {}
    protected _slideL:any={}
    protected _masterShapes:any = []
    protected _slideShapes:any=[]
    constructor(n?:number){
        if (typeof(n)!='undefined'){
            this.slidenr=n
        }        
    }

    getSlideLayoutName(slideRel:any, slideNr:number){
        let slr =  slideRel['slide'+slideNr+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let layoutName =  slr.split('/')[2]
        return layoutName
    }
    getMasterLayoutName(slideLayoutRel:any, slideNr:number){
        // let smr =  slideLayoutRel['Relationships']['Relationship']['@_Target']
        let smr =  slideLayoutRel['slideLayout'+slideNr+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let masterName =  smr.split('/')[2]
        return masterName
        // return (this._slideMasters[masterName])
    }

    getMasterShapes(slideMasters:object, n:number){
        let layout = getNested(slideMasters,'slideMaster'+n+'.xml')
        let ShapeTree = layout['p:sldMaster']['p:cSld']['p:spTree']['p:sp']
        for (let sp in ShapeTree){
            let shape = new Shape()
            shape._shapes = ShapeTree[sp]
            this._masterShapes.push(shape.getShapeProps())
        }   
        return this._masterShapes

    }

    getLayoutShapes(){}
    getSlideShapes(slides:object,n:number){
        let layout = getNested(slides,'slide'+n+'.xml')
        // let shapeTree = layout['p:sld']['p:cSld']['p:spTree']['p:sp']
        let shapeTree = getNested(layout, 'p:sld','p:cSld','p:spTree','p:sp')
        for (let sp in shapeTree){
            let shape = new Shape()
            shape._shapes = shapeTree[sp]
            this._slideShapes.push(shape.getShapeProps())
        }
        let groupTree = getNested(layout, 'p:sld','p:cSld','p:spTree','p:grpSp','p:sp')
        for (let sp in groupTree){
            let shape = new Shape()
            shape._shapes = groupTree[sp]
            this._slideShapes.push(shape.getShapeProps())
        }

        return this._slideShapes
        

    }

    


}

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
    type = 'slide'
    master:Slide|undefined
    layout:Slide|undefined
    rel:Rel|undefined
    theme:any

    constructor(obj?:Object){        
        this._slideObj = obj;
    }


    get clrMap():any{
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

    getShapes(LayoutName:String){
        return {}
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
            res[cnt] = i['attributes']['Target'];
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



