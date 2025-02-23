
import {PreSetGeom, ShapeProp} from './interface'
import {Fill, Stroke, Color, Paragraph} from './style'
import {getbyPath} from './util'
import { Slide } from './slide';



export class Shape{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    _shapes:any={};
    props: ShapeProp = {pos: {x:0, y:0, h:0, w:0},prstGeom:'rect'};
    private posProp=false
    fill!:Fill
    stroke!:Stroke
    effectFill:Fill|undefined
    fontFill:Fill|undefined
    txtAnchor = 't'
    src = 'slide'
    name = ""
    id = ""
    phType =""
    idx =0
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
    paragraph:Paragraph[] = []
     
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
        let ph:any = getbyPath(obj,"p:sp/p:nvSpPr/p:nvPr/p:ph")
        if(ph!=null){
            this.phType = ph['attributes']['type']
        }
        let spPr:any = getbyPath(obj,'p:sp/p:spPr')
        // console.log(spPr)
        if(spPr!=null){
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
                    this.posProp=true                   
                }
                // line fill props
                if(spPr['elements'][el]['name']=='a:solidFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)                 
                }
                if(spPr['elements'][el]['name']=='a:blipFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)                  
                }
                if(spPr['elements'][el]['name']=='a:gradFill'){
                    this.fill = new Fill(spPr['elements'][el],this.slideRef?.clrMap,this.slideRef?.theme)                
                }
                if(spPr['elements'][el]['name']=='a:noFill'){
                    this.fill.fillType="noFill"               
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
                    let lnElements = spPr['elements'][el]['elements']
                    this.stroke = new Stroke()
                    for (let el1 in lnElements ){
                        if(lnElements[el1]['name']=='a:solidFill'){
                            this.stroke.fill = new Fill(lnElements[el1],this.slideRef?.clrMap,this.slideRef?.theme)                  
                        }
                        if(lnElements[el1]['name']=='a:gradFill'){
                            this.stroke.fill = new Fill(lnElements[el1],this.slideRef?.clrMap,this.slideRef?.theme)                 
                        }                        
                        if(lnElements[el1]['name']=='a:noFill'){
                            this.stroke.fill.fillType="noFill"                 
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
        }

        let spStyle:any = getbyPath(obj,'p:sp/p:style')
        if(spStyle!=null){
            for(let el in spStyle['elements']){

                // line fill (set if it is not set previously)
                if(spStyle['elements'][el]['name']=='a:lnRef'){
                    if(this.stroke==undefined){
                        this.stroke=new Stroke()
                        let color = new Color(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)
                        this.stroke.fill.fillType="solidFill"
                        this.stroke.fill.fillVal = color.getColor()
                    }                                       
                }
                // shp fill (set if not set previoustly)
                if(spStyle['elements'][el]['name']=='a:fillRef'){
                    if(this.fill==undefined){
                        this.fill = new Fill()
                        let color = new Color(spStyle['elements'][el]['elements'][0],this.slideRef?.clrMap,this.slideRef?.theme)
                        this.fill.fillType="solidFill"
                        this.fill.fillVal=color.getColor()
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
            for (let el in txtBody['elements']){
                if(txtBody['elements'][el]['name']=='a:bodyPr'){
                    if(txtBody['elements'][el]['attributes']){
                        let txtAnchor = txtBody['elements'][el]['attributes']['anchor']
                        if(txtAnchor!=null){this.txtAnchor=txtAnchor}
                    }
                }
                if(txtBody['elements'][el]['name']=='a:lstStyle'){
                    // console.log(txtBody['elements'][el])
                }
                if(txtBody['elements'][el]['name']=='a:p'){
                    let p = new Paragraph()
                    p.obj = txtBody['elements'][el]
                    this.paragraph.push(p)
                }
            }
        }

        if(this.slideRef?.type=='slide'){
            // default fill
            if (this.fill==undefined){
                let layoutSp = this.slideRef?.layout?.getShapebyPh(this.phType)
                if(layoutSp!=undefined){
                    this.fill = layoutSp.fill
                }if(this.fill==undefined){
                    let mstrSp = this.slideRef?.layout?.master?.getShapebyPh(this.phType)
                    if(mstrSp!=undefined){
                        this.fill = mstrSp.fill
                    }   
                }if(this.fill==undefined){
                    this.fill = new Fill()
                    this.fill.fillType='noFill'
                }
            }
            // default stroke
            if (this.stroke==undefined){
                let layoutSp = this.slideRef?.layout?.getShapebyPh(this.phType)
                if(layoutSp!=undefined){
                    this.stroke = layoutSp.stroke
                }if(this.stroke==undefined){
                    let mstrSp = this.slideRef?.layout?.master?.getShapebyPh(this.phType)
                    if(mstrSp!=undefined){
                        this.stroke = mstrSp.stroke
                    }
                }if(this.stroke==undefined){
                    this.stroke = new Stroke()
                    this.stroke.fill.fillType='noFill'
                }
            }
            // default font fill
            if (this.fontFill==undefined){
                let layoutSp = this.slideRef?.layout?.getShapebyPh(this.phType)
                if(layoutSp!=undefined){
                    this.fontFill = layoutSp.fontFill
                }if(this.fontFill==undefined){
                    let mstrSp = this.slideRef?.layout?.master?.getShapebyPh(this.phType)
                    if(mstrSp!=undefined){
                        this.fontFill = mstrSp.fontFill
                    }
                }if(this.fontFill==undefined){
                    this.fontFill = new Fill()
                    this.fontFill.fillType='solidFill'
                    this.fontFill.fillVal='#000000'
                }
            }

            // get Pos
            if (this.posProp==false){
                let layoutSp = this.slideRef?.layout?.getShapebyPh(this.phType)
                if(layoutSp!=undefined){
                    if(layoutSp.posProp==true){
                        this.posProp=true
                        this.x = layoutSp.x
                        this.y = layoutSp.y
                        this.w = layoutSp.w
                        this.h = layoutSp.h
                    }else{
                        let mstrSp = this.slideRef?.layout?.master?.getShapebyPh(this.phType)
                        if(mstrSp!=undefined && mstrSp.posProp==true){
                            this.posProp=true
                            this.x = mstrSp.x
                            this.y = mstrSp.y
                            this.w = mstrSp.w
                            this.h = mstrSp.h
                        }
                    }
                }
            }
        }
        
    }

    



}
