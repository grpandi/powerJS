
import {ShapeProp} from './interface'
import {getNested} from './util'

export class Shape{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    _shapes:any={};
    _props: ShapeProp = {id:'0', name:'0',pos: {x:0, y:0, h:0, w:0},prstGeom:''};
    

    constructor(){
        this._shapes={}
    }

   

    getShapeProps():ShapeProp{
        this._props.id=this._shapes['p:nvSpPr']['p:cNvPr']['@_id']
        this._props.name=this._shapes['p:nvSpPr']['p:cNvPr']['@_name']
        this._props.pos ={}
        this._props.pos.x=getNested(this._shapes,'p:spPr','a:xfrm','a:off','@_x')
        this._props.pos.y=getNested(this._shapes,'p:spPr','a:xfrm','a:off','@_y')
        this._props.pos.h=getNested(this._shapes,'p:spPr','a:xfrm','a:ext','@_cx')
        this._props.pos.w=getNested(this._shapes,'p:spPr','a:xfrm','a:ext','@_cy')
        this._props.prstGeom = getNested(this._shapes,'p:spPr','a:prstGeom','@_prst')
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
        
        return this._props
        
    }


}
