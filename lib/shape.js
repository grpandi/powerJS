
class Shapes{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    
    constructor(){
        this.shapes={}
        this.props={}
    }

    getShapeProps(){
        this.props={}
        this.props.id=this.shapes['p:nvSpPr']['p:cNvPr']['@_id']
        this.props.name=this.shapes['p:nvSpPr']['p:cNvPr']['@_name']
        this.props.x=this.getNested(this.shapes,'p:spPr','a:xfrm','a:off','@_x')
        this.props.y=this.getNested(this.shapes,'p:spPr','a:xfrm','a:off','@_y')
        this.props.cx=this.getNested(this.shapes,'p:spPr','a:xfrm','a:ext','@_cx')
        this.props.cy=this.getNested(this.shapes,'p:spPr','a:xfrm','a:ext','@_cy')
        this.props.prstGeom = this.getNested(this.shapes,'p:spPr','a:prstGeom','@_prst')
        this.props.ln_prstDash = this.getNested(this.shapes,'p:spPr','a:ln','a:prstDash','@_val')
        this.props.solidFill = this.getNested(this.shapes,'p:spPr','a:solidFill','a:srgbClr','@_val')

        this.props.txt_vert = this.getNested(this.shapes,'p:txBody','a:bodyPr','@_vert')
        this.props.txt_anchor = this.getNested(this.shapes,'p:txBody','a:bodyPr','@_anchor')
        this.props.txt_par = this.getNested(this.shapes,'p:txBody','a:p','a:r','a:t')
        this.props.txt_parLlvs = []
        if(typeof this.getNested(this.shapes,'p:txBody','a:p','a:r','a:t')=='undefined'){
            let lvls = this.getNested(this.shapes,'p:txBody','a:p')
            for(let lvl in lvls){
                let txt = this.getNested(lvls[lvl],'a:r','a:t')
                this.props.txt_parLlvs.push(txt)   
            }
                
        }
        this.props.style={}
        // console.log(this.getNested(this.shapes,'p:style','a:lnRef'))
        if(typeof this.getNested(this.shapes,'p:style','a:lnRef','@_idx')!='undefined'){
            this.props.style.lnRef_idx = this.getNested(this.shapes,'p:style','a:lnRef','@_idx')
            this.props.style.lnRef_schemeClr = this.getNested(this.shapes,'p:style','a:lnRef','a:schemeClr', '@_val')
            this.props.style.lnRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:lnRef','a:schemeClr','a:shade', '@_val')

            this.props.style.fillRef_idx = this.getNested(this.shapes,'p:style','a:fillRef','@_idx')
            this.props.style.fillRef_schemeClr = this.getNested(this.shapes,'p:style','a:fillRef','a:schemeClr', '@_val')
            this.props.style.fillRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:fillRef','a:schemeClr','a:shade', '@_val')

            this.props.style.effectRef_idx = this.getNested(this.shapes,'p:style','a:effectRef','@_idx')
            this.props.style.effectRef_schemeClr = this.getNested(this.shapes,'p:style','a:effectRef','a:schemeClr', '@_val')
            this.props.style.effectRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:effectRef','a:schemeClr','a:shade', '@_val')

            this.props.style.fontRef_idx = this.getNested(this.shapes,'p:style','a:fontRef','@_idx')
            this.props.style.fontRef_schemeClr = this.getNested(this.shapes,'p:style','a:fontRef','a:schemeClr', '@_val')
            this.props.style.fontRef_schemeClr_shade = this.getNested(this.shapes,'p:style','a:fontRef','a:schemeClr','a:shade', '@_val')
        }
        
        return this.props
        
    }

    getNested(obj, ...args) {
        return args.reduce((obj, level) => obj && obj[level], obj)
      }

}

module.exports = Shapes