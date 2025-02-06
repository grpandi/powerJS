
import {PreSetGeom, ShapeProp} from './interface'
import {Fill, Stroke, Color} from './style'
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
    effectFill:Fill|undefined
    fontFill:Fill|undefined
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
    guide:any = []
     
    constructor(x:number=0,y:number=0,w:number=0,h:number=0){
        this.x=x;this.y=y;this.h=h;this.w=w
    }

    set slideReference(sld:Slide){
        this.slideRef=sld
    }

    set obj (obj:any){
        this._shapes = obj
        let nvPr:any = getbyPath(obj, "p:sp/p:nvSpPr/p:cNvPr")
        if(nvPr!=null){
            this.name=nvPr['attributes']['name']
            this.id = nvPr['attributes']['id']
            // 'Hidden' attribute?
        }
        let spPr:any = getbyPath(obj,'p:sp/p:spPr')
        // console.log(spPr)
        if(spPr!=null){
            for(let el in spPr['elements']){
                // console.log(el)
                this.spPr=true
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
                    this.posProp=true                   
                }
                // line fill props
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
                // preset geometry
                if(spPr['elements'][el]['name']=='a:prstGeom'){
                    this.prstGeom = spPr['elements'][el]['attributes']['prst']
                    let avLst:any = getbyPath(spPr['elements'][el],'a:avLst')
                    if(avLst !=null){
                        let avLstEl = avLst['elements']
                        for(let el1 in avLstEl){
                            if(avLstEl[el1]['name']=='a:gd'){
                                let name:any = avLstEl[el1]['attributes']['name']
                                let fmla:any = avLstEl[el1]['attributes']['fmla']
                                this.guide.push({name:name, fmla:fmla})
                            }
                        }
                    }
                }

                // outLine
                if(spPr['elements'][el]['name']=='a:ln'){
                    this.lnProp=true
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
                            if(lnElements[el1]['attributes']['val']=='dash'){
                                this.stroke.dash = [5,5]
                            }else if(lnElements[el1]['attributes']['val']=='lgDash'){
                                this.stroke.dash = [10,5]
                            }else if(lnElements[el1]['attributes']['val']=='solid'){
                                this.stroke.dash = []
                            }else if(lnElements[el1]['attributes']['val']=='sysDot'){
                                this.stroke.dash = [1,1]
                            }else if(lnElements[el1]['attributes']['val']=='sysDash'){
                                this.stroke.dash = [5,2]
                            }else if(lnElements[el1]['attributes']['val']=='sysDashDot'){
                                this.stroke.dash = [5,2,1,2]
                            }else if(lnElements[el1]['attributes']['val']=='sysDashDotDot'){
                                this.stroke.dash = [5,2,1,2,1,2]
                            }else if(lnElements[el1]['attributes']['val']=='dot'){
                                this.stroke.dash = [1,2]
                            }else if(lnElements[el1]['attributes']['val']=='lgDashDot'){
                                this.stroke.dash = [10,5,1,5]
                            }else if(lnElements[el1]['attributes']['val']=='lgDashDotDot'){
                                this.stroke.dash = [10,5,1,5,1,5]
                            }

                        }
                        // round (todo)
                        // custDash(todo)
                        // mitter (todo)
                        // headEnd
                        if(lnElements[el1]['name']=='a:headEnd'){
                           this.stroke.hEnd.len=  lnElements[el1]['attributes']['len'] 
                           this.stroke.hEnd.len=  lnElements[el1]['attributes']['type']
                           this.stroke.hEnd.len=  lnElements[el1]['attributes']['w']             
                        }
                        // tailend
                        if(lnElements[el1]['name']=='a:tailEnd'){
                            this.stroke.hEnd.len=  lnElements[el1]['attributes']['len'] 
                            this.stroke.hEnd.len=  lnElements[el1]['attributes']['type']
                            this.stroke.hEnd.len=  lnElements[el1]['attributes']['w']             
                         }


                    }
                }

                // custom geometry (todo)
                
                // effect Container (todo)
                                

            }
        }else{this.spPr=false}

        let spStyle:any = getbyPath(obj,'p:sp/p:style')
        if(spStyle!=null){
            for(let el in spStyle['elements']){

                // line fill (set if it is not set previously)
                if(spStyle['elements'][el]['name']=='a:lnRef'){
                    if(this.lnFillPro!=true){
                        let color = new Color(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)
                        this.stroke.fill.fillType="solidFill"
                        this.stroke.fill.fillVal = color.getColor()
                        this.lnFillPro=true
                    }                                       
                }
                // shp fill (set if not set previoustly)
                if(spStyle['elements'][el]['name']=='a:fillRef'){
                    if(this.fillProp!=true){
                        let color = new Color(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)
                        this.fill.fillType="solidFill"
                        this.fill.fillVal=color.getColor()
                        this.fillProp=true
                    }                                       
                }
                // font fill
                if(spStyle['elements'][el]['name']=='a:fontRef'){
                    let color = new Color(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)
                    this.fontFill=new Fill()
                    this.fontFill.fillType="solidFill"
                    this.fontFill.fillVal=color.getColor()                 
                }

                // effect
                if(spStyle['elements'][el]['name']=='a:effectRef'){
                    this.effectFill = new Fill(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)                  
                }

            }   
        }

        

        let txtBody:any = getbyPath(obj,'p:sp/p:txBody')
        if(txtBody!=null){
            
        }
    }

    



}
