
import {PreSetGeom, ShapeProp} from './interface'
import {Fill, Stroke} from './style'
import {getbyPath} from './util'
import { Slide } from './slide';


export class Shape{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    _shapes:any={};
    props: ShapeProp = {pos: {x:0, y:0, h:0, w:0},prstGeom:'rect'};
    private spPr=false
    private posProp=false
    private fillProp=false
    private lnProp=false
    private lnFillPro=false
    fill:Fill = new Fill()
    stroke:Stroke = new Stroke()
    src = 'slide'
    name = ""
    id = ""
    private slideRef:Slide|undefined
    private Spobj:any
    private groupid=""
    private groupName=""
    x=0
    y=0
    h=0
    w=0
    prstGeom:PreSetGeom='rect'
     
    constructor(x:number=0,y:number=0,w:number=0,h:number=0){
        this.x=x;this.y=y;this.h=h;this.w=w
    }

    set slideReference(sld:Slide){
        this.slideRef=sld
    }

    set obj (obj:any){
        this._shapes = obj
        let nvPr:any = getbyPath(obj, "p:sp/p:nvSpPr/p:cNvPr")
        if('attributes' in nvPr){
            this.name=nvPr['attributes']['name']
            this.id = nvPr['attributes']['id']
            // 'Hidden' attribute?
        }
        let spPr:any = getbyPath(obj,'p:sp/p:spPr')
        // console.log(spPr)
        if('elements' in spPr){
            for(let el in spPr['elements']){
                // console.log(el)
                if(spPr['elements'][el]['name']=='a:xfrm'){
                    let aOff:any = getbyPath(spPr['elements'][el],'a:xfrm/a:off')
                    if(aOff !=null){
                        this.x = parseInt(aOff['attributes']['x'])/(914400)*96
                        this.y = parseInt(aOff['attributes']['y'])/(914400)*96
                    }
                    let aExt:any = getbyPath(spPr['elements'][el],'a:xfrm/a:ext')
                    if(aExt !=null){
                        this.w = parseInt(aExt['attributes']['cx'])/(914400)*96
                        this.h = parseInt(aExt['attributes']['cy'])/(914400)*96
                    }                   
                }

                if(spPr['elements'][el]['name']=='a:solidFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)
                    this.fillProp=true                   
                }
                if(spPr['elements'][el]['name']=='a:blipFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)
                    this.fillProp=true                   
                }
                if(spPr['elements'][el]['name']=='a:gradFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)
                    this.fillProp=true                 
                }
                if(spPr['elements'][el]['name']=='a:noFill'){
                    this.fill.fillType="noFill"
                    this.fillProp=true                 
                }
                
                if(spPr['elements'][el]['name']=='a:prstGeom'){
                    this.prstGeom = spPr['elements'][el]['attributes']['prst']
                }

                // outLine
                if(spPr['elements'][el]['name']=='a:ln'){
                    let lnElements = spPr['elements'][el]['elements']
                    for (let el1 in lnElements ){
                        if(lnElements[el1]['name']=='a:solidFill'){
                            this.stroke.fill = new Fill(lnElements[el1],this.slideRef?.clrMap,this.slideRef?.theme)
                            this.lnFillPro=true                   
                        }
                        if(lnElements[el1]['name']=='a:gradFill'){
                            this.stroke.fill = new Fill(lnElements[el1],this.slideRef?.clrMap,this.slideRef?.theme)
                            this.lnFillPro=true                   
                        }                        
                        if(lnElements[el1]['name']=='a:noFill'){
                            this.stroke.fill.fillType="noFill"
                            this.lnFillPro=true                  
                        }
                        if(lnElements[el1]['name']=='a:prstDash'){
                            this.stroke.dash = lnElements[el1]['attributes']['val']                
                        }
                        // round (todo)
                        // tailend(todo)
                        // custDash(todo)
                        // mitter (todo)
                        // headEnd(todo)


                    }
                }


                // custom geometry (todo)
                // preset geometry (todo)
                // effect Container (todo)
                
                

            }
        }else{this.spPr=false}
    }

    getShapeProps():ShapeProp{
        
        this.props.pos ={}
        // this.props.pos.x=getNested(this._shapes,'p:spPr','a:xfrm','a:off','@_x')
        // this.props.pos.y=getNested(this._shapes,'p:spPr','a:xfrm','a:off','@_y')
        // this.props.pos.h=getNested(this._shapes,'p:spPr','a:xfrm','a:ext','@_cx')
        // this.props.pos.w=getNested(this._shapes,'p:spPr','a:xfrm','a:ext','@_cy')
        // this.props.prstGeom = getNested(this._shapes,'p:spPr','a:prstGeom','@_prst')
        // this._props.ln_prstDash = this.getNested(this._shapes,'p:spPr','a:ln','a:prstDash','@_val')
        // this._props.solidFill = this.getNested(this._shapes,'p:spPr','a:solidFill','a:srgbClr','@_val')

        // this._props.txt_vert = this.getNested(this._shapes,'p:txBody','a:bodyPr','@_vert')
        // this._props.txt_anchor = this.getNested(this._shapes,'p:txBody','a:bodyPr','@_anchor')
        // this._props.txt_par = this.getNested(this._shapes,'p:txBody','a:p','a:r','a:t')
        // this._props.txt_parLlvs = []
        // if(typeof this.getNested(this._shapes,'p:txBody','a:p','a:r','a:t')=='undefined'){
        //     let lvls = this.getNested(this._shapes,'p:txBody','a:p')
        //     for(let lvl in lvls){
        //         let txt = this.getNested(lvls[lvl],'a:r','a:t')
        //         this._props.txt_parLlvs.push(txt)   
        //     }
                
        // }
        // this.props.style={}
        // // console.log(this.getNested(this.shapes,'p:style','a:lnRef'))
        // if(typeof this.getNested(this.shapes,'p:style','a:lnRef','@_idx')!='undefined'){
        //     this.props.style.lnRef_idx = this.getNested(this.shapes,'p:style','a:lnRef','@_idx')
        //     this.props.style.lnRef_schemeClr = this.getNested(this.shapes,'p:style','a:lnRef','a:schemeClr', '@_val')
        //     this.props.style.lnRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:lnRef','a:schemeClr','a:shade', '@_val')

        //     this.props.style.fillRef_idx = this.getNested(this.shapes,'p:style','a:fillRef','@_idx')
        //     this.props.style.fillRef_schemeClr = this.getNested(this.shapes,'p:style','a:fillRef','a:schemeClr', '@_val')
        //     this.props.style.fillRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:fillRef','a:schemeClr','a:shade', '@_val')

        //     this.props.style.effectRef_idx = this.getNested(this.shapes,'p:style','a:effectRef','@_idx')
        //     this.props.style.effectRef_schemeClr = this.getNested(this.shapes,'p:style','a:effectRef','a:schemeClr', '@_val')
        //     this.props.style.effectRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:effectRef','a:schemeClr','a:shade', '@_val')

        //     this.props.style.fontRef_idx = this.getNested(this.shapes,'p:style','a:fontRef','@_idx')
        //     this.props.style.fontRef_schemeClr = this.getNested(this.shapes,'p:style','a:fontRef','a:schemeClr', '@_val')
        //     this.props.style.fontRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:fontRef','a:schemeClr','a:shade', '@_val')
        // }
        
        return this.props
        
    }



}
