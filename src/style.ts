import { parse } from 'path';
import {BGtype, HAlign} from './interface';
import {getbyPath} from './util'



export class Fill{
    private type:BGtype='solidFill'
    private fillObj:any
    private clrMap:any
    private theme:any
    private val:any="#FFFFFF"
    alpha=1
    constructor(obj?:any, clrMap?:any, theme?:any){
        if(obj!=undefined){
            this.fillObj = obj
        }
        if(clrMap!=undefined){
            this.clrMap = clrMap
        }
        if(theme!=undefined){
            this.theme = theme
          }
          
          this.evalFill()
    }

    private evalFill(){
      if(this.fillObj==undefined){return}
      if(this.fillObj['name']=='a:solidFill'){ 
        this.type='solidFill'       
        let clr = new Color(this.fillObj['elements'][0], this.clrMap, this.theme)
        this.val = clr.getColor()

      }
      if(this.fillObj['name']=='a:gradFill'){
        this.type = "gradientFill"                                 
        let gradStopObj:any = getbyPath(this.fillObj, 'a:gsLst')
        let val: { gradient: { pos: number; clr: string }[]; linang: number } = { gradient: [], linang: 0 }
        for (let gs of gradStopObj['elements']){
          let clrClass = new Color(gs['elements'][0], this.clrMap, this.theme)
          let clr:any = clrClass.getColor()
          let gsPos:any = parseInt(gs['attributes']['pos'])/1000
          val.gradient.push({pos:gsPos,clr})
        }
        let linangObj:any = getbyPath(this.fillObj, 'a:lin')
        if(linangObj!=null){
          val.linang = parseInt(linangObj['attributes']['ang'])/60000
        }
        this.val = val
      }
      if(this.fillObj['name']=='a:blipFill'){
        this.type = "imageFill"
        let imgFillObj:any = getbyPath(this.fillObj, 'a:blip')
        let imgFill = new ImageFill()
        imgFill.fillSrc = imgFillObj['attributes']['r:embed']
        this.val = imgFill
      }
    }
    set fillType(t:BGtype){this.type = t}
    set fillVal(v:any){this.val = v}
    
    getType():string{
      return this.type
    }
    getVal():any{
      return this.val
    }
    
}

export class Color{
	private clrObject:any;
  clrMap:any;
  theme:any;
  alpha=1;
  lumOff:number = 0
  shade:number = 1
  private val = "#FFFFFF"
  constructor(clrObj?:any, clrMp?:any, thm?:any){
    if(clrObj!=undefined){
      this.clrObject = clrObj
    }
    if(clrMp!=undefined){
      this.clrMap = clrMp
    }
    if(thm!=undefined){
      this.theme = thm
    }
  }
  set clrObj(clrObj:any){this.clrObject = clrObj}
  set clrMp(clrMp:any){this.clrMap = clrMp}
  set thm(thm:any){this.theme = thm}
  
  private presetColors:any={'indianred':'#CD5C5C','lightcoral':'#F08080','salmon':'#FA8072','darksalmon':'#E9967A','lightsalmon':'#FFA07A',
    'crimson':'#DC143C','red':'#FF0000','firebrick':'#B22222','darkred':'#8B0000','pink':'#FFC0CB','lightpink':'#FFB6C1',
    'hotpink':'#FF69B4','deeppink':'#FF1493','mediumvioletred':'#C71585','palevioletred':'#DB7093',
    'coral':'#FF7F50','tomato':'#FF6347','orangered':'#FF4500','darkorange':'#FF8C00','orange':'#FFA500','gold':'#FFD700',
    'yellow':'#FFFF00','lightyellow':'#FFFFE0','lemonchiffon':'#FFFACD','lightgoldenrodyellow':'#FAFAD2','papayawhip':'#FFEFD5',
    'moccasin':'#FFE4B5','peachpuff':'#FFDAB9','palegoldenrod':'#EEE8AA','khaki':'#F0E68C','darkkhaki':'#BDB76B',
    'lavender':'#E6E6FA','thistle':'#D8BFD8','plum':'#DDA0DD','violet':'#EE82EE','orchid':'#DA70D6','fuchsia':'#FF00FF',
    'magenta':'#FF00FF','mediumorchid':'#BA55D3','mediumpurple':'#9370DB','rebeccapurple':'#663399','blueviolet':'#8A2BE2',
    'darkviolet':'#9400D3','darkorchid':'#9932CC','darkmagenta':'#8B008B','purple':'#800080','indigo':'#4B0082',
    'slateblue':'#6A5ACD','darkslateblue':'#483D8B','mediumslateblue':'#7B68EE','greenyellow':'#ADFF2F','chartreuse':'#7FFF00',
    'lawngreen':'#7CFC00','lime':'#00FF00','limegreen':'#32CD32','palegreen':'#98FB98','lightgreen':'#90EE90',
    'mediumspringgreen':'#00FA9A','springgreen':'#00FF7F','mediumseagreen':'#3CB371','seagreen':'#2E8B57','forestgreen':'#228B22',
    'green':'#008000','darkgreen':'#006400','yellowgreen':'#9ACD32','olivedrab':'#6B8E23','olive':'#808000',
    'darkolivegreen':'#556B2F','mediumaquamarine':'#66CDAA','darkseagreen':'#8FBC8B','lightseagreen':'#20B2AA','darkcyan':'#008B8B',
    'teal':'#008080','aqua':'#00FFFF','cyan':'#00FFFF','lightcyan':'#E0FFFF','paleturquoise':'#AFEEEE','aquamarine':'#7FFFD4',
    'turquoise':'#40E0D0','mediumturquoise':'#48D1CC','darkturquoise':'#00CED1','cadetblue':'#5F9EA0','steelblue':'#4682B4',
    'lightsteelblue':'#B0C4DE','powderblue':'#B0E0E6','lightblue':'#ADD8E6','skyblue':'#87CEEB','lightskyblue':'#87CEFA',
    'deepskyblue':'#00BFFF','dodgerblue':'#1E90FF','cornflowerblue':'#6495ED','royalblue':'#4169E1','blue':'#0000FF',
    'mediumblue':'#0000CD','darkblue':'#00008B','navy':'#000080','midnightblue':'#191970','cornsilk':'#FFF8DC',
    'blanchedalmond':'#FFEBCD','bisque':'#FFE4C4','navajowhite':'#FFDEAD','wheat':'#F5DEB3','burlywood':'#DEB887',
    'tan':'#D2B48C','rosybrown':'#BC8F8F','sandybrown':'#F4A460','goldenrod':'#DAA520','darkgoldenrod':'#B8860B',
    'peru':'#CD853F','chocolate':'#D2691E','saddlebrown':'#8B4513','sienna':'#A0522D','brown':'#A52A2A','maroon':'#800000',
    'white':'#FFFFFF','snow':'#FFFAFA','honeydew':'#F0FFF0','mintcream':'#F5FFFA','azure':'#F0FFFF','aliceblue':'#F0F8FF',
    'ghostwhite':'#F8F8FF','whitesmoke':'#F5F5F5','seashell':'#FFF5EE','beige':'#F5F5DC','oldlace':'#FDF5E6','floralwhite':'#FFFAF0',
    'ivory':'#FFFFF0','antiquewhite':'#FAEBD7','linen':'#FAF0E6','lavenderblush':'#FFF0F5','mistyrose':'#FFE4E1','gainsboro':'#DCDCDC',
    'lightgray':'#D3D3D3','silver':'#C0C0C0','darkgray':'#A9A9A9','gray':'#808080','dimgray':'#696969','lightslategray':'#778899',
    'slategray':'#708090','darkslategray':'#2F4F4F','black':'#000000'}

  private systemColors:any ={'activeborder':'#C0C0C0','activecaption':'#000080','appworkspace':'#808080','background':'#3A6EA5',
    'buttonface':'#C0C0C0','buttonhighlight':'#FFFFFF','buttonshadow':'#808080','buttontext':'#000000','captiontext':'#FFFFFF',
    'graytext':'#808080','highlight':'#000080','highlighttext':'#FFFFFF','inactiveborder':'#C0C0C0','inactivecaption':'#808080',
    'inactivecaptiontext':'#C0C0C0','infobackground':'#FFFFFF','infotext':'#000000','menu':'#C0C0C0','menutext':'#000000',
    'scrollbar':'#C0C0C0','threeddarkshadow':'#000000','threedface':'#C0C0C0','threedhighlight':'#FFFFFF',
    'threedlightshadow':'#C0C0C0','threedshadow':'#808080','window':'#ffffff','windowframe':'#000000','windowtext':'#000000'}

  getColor():String{
      if(typeof (this.clrObject) === 'undefined'){
          return this.val;
      }

      // hslClr
      if(this.clrObject['name']=='a:hslClr'){
        let clr = this.readHSL()
        return clr
      }
      // presetClr
      if(this.clrObject['name']=='a:prstClr'){
        let clr = this.readPreset()
        return clr
      }
      // scrgbClr
      if(this.clrObject['name']=='a:scrgbClr'){
        let clr = this.readScRGB()
        return clr
      }
      // sysClr
      if(this.clrObject['name']=='a:sysClr'){
        let clr = this.readSysClr()
        return clr
      }
      // schemeClr
      if(this.clrObject['name']=='a:schemeClr'){
        let clr = this.readSchemeClr()
        return clr
      }
      // srgbClr
      if(this.clrObject['name']=='a:srgbClr'){
        let clr = this.readsrgbClr()
        return clr
      }

      return this.val;
  }

// functions to resolve types of color objects
    // to test
    private readHSL(){
      let hsl={hue:0, saturation:0, lightness:0}
      if('hue' in this.clrObject['attributes']){
        hsl.hue = parseInt(this.clrObject['attributes']['hue'])/10000
      }
      if('sat' in this.clrObject['attributes']){
        hsl.saturation = parseInt(this.clrObject['attributes']['sat'])
      }
      if('lum' in this.clrObject['attributes']){
        hsl.lightness = parseInt(this.clrObject['attributes']['lum'])
      }
      let hueElemVal:any = getbyPath(this.clrObject, 'a:hslClr/a:hue')
      if(hueElemVal != null){
        hsl.hue = parseInt(hueElemVal['attributes']['val'])/10000
      }
      this.clrAddOns('a:hslClr')
      let clr = this.HSLToHex(hsl.hue, hsl.saturation, hsl.lightness + this.lumOff)            
      if(this.shade<1){clr=this.addShader(clr)}
      return clr
    }
    // to test
    private readPreset(){
      let preSetval = this.clrMap[this.clrObject['attributes']['val']]
      this.clrAddOns('a:prstClr')
      let clr = this.presetColors[preSetval.toLowerCase()]
      if(this.lumOff>0){clr=this.lumOffSet(clr)}             
      if(this.shade<1){clr=this.addShader(clr)}
      return clr
    }
    // to test
    private readScRGB(){
      let rgbObj:any = getbyPath(this.clrObject, 'a:scrgbClr/p:rgb')
      let r = parseInt(rgbObj['attributes']['r'])
      let g = parseInt(rgbObj['attributes']['g'])
      let b = parseInt(rgbObj['attributes']['b'])
      this.clrAddOns('a:scrgbClr')
      let clr:any = this.rgbtoHex(r,g,b)
      if(this.lumOff>0){clr=this.lumOffSet(clr)}             
      if(this.shade<1){clr=this.addShader(clr)}
      return clr
    }
  
    private readSysClr(){
      let clrVal = this.clrObject['attributes']['val']
      this.clrAddOns('a:sysClr')
      let clr = this.systemColors[clrVal.toLowerCase()]
      if(this.lumOff>0){clr=this.lumOffSet(clr)}             
      if(this.shade<1){clr=this.addShader(clr)}
      return clr
    }

    private readSchemeClr(){
      let clrVal = this.clrObject['attributes']['val']
      clrVal = this.clrMap[clrVal]
      if(clrVal==null){clrVal =this.clrObject['attributes']['val'] }
      this.clrAddOns('a:schemeClr')
      let themeClrObj:any = getbyPath(this.theme,'a:themeElements/a:clrScheme/a:'+clrVal)
      let nclr = new Color()
      // console.log(themeClrObj)
      nclr.clrObj = themeClrObj['elements'][0]
      let clr:any = nclr.getColor()
      if(this.lumOff>0){clr=this.lumOffSet(clr)}             
      if(this.shade<1){clr=this.addShader(clr)}
      return clr
    }
    
    private readsrgbClr(){
      let clr = this.clrObject['attributes']['val']
      if(clr.includes("#")==false){clr="#"+clr}
      this.clrAddOns('a:srgbClr')
      if(this.lumOff>0){clr=this.lumOffSet(clr)}             
      if(this.shade<1){clr=this.addShader(clr)}

      return clr
    }
    
    private clrAddOns(path:string){
      let lumOffset:any = getbyPath(this.clrObject, path+'/a:lumOff')
      if(lumOffset != null){
        this.lumOff = parseInt(lumOffset['attributes']['val'])/1000
      }

      let shdOffset:any = getbyPath(this.clrObject, path+'/a:shade')
      if(shdOffset != null){
        this.shade = (parseInt(shdOffset['attributes']['val'])/1000)/100
      }
      
    }

    private lumOffSet(hexclr:any){
      let clr:any = this.hexToRGB(hexclr)
      clr = this.rgbToHSL(clr.r, clr.g, clr.b)
      clr = this.HSLToHex(clr.h,clr.s, this.lumOff)
      return clr
    }
    private addShader(hexclr:any){
      let clr:any = this.hexToRGB(hexclr)
      clr.r = Math.round(clr.r*this.shade)
      clr.g = Math.round(clr.g*this.shade)
      clr.b = Math.round(clr.b*this.shade)
      clr = this.rgbtoHex(clr.r, clr.g, clr.b)
      return clr
    }



// color conversion functions
	  private hsl_rgb(h:any, s:any, l:any) {
            // Scale h to 0..1 with modulo for negative values too
            h = (((h / 360) % 1) + 1) % 1;
            if (s === 0)
                return [l, l, l];
            var t3s = [ h + 1 / 3, h, h - 1 / 3 ],
                t2 = l < 0.5 ? l * (1 + s) : l + s - l * s,
                t1 = 2 * l - t2,
                c = [];
            for (var i = 0; i < 3; i++) {
                var t3 = t3s[i];
                if (t3 < 0) t3 += 1;
                if (t3 > 1) t3 -= 1;
                c[i] = 6 * t3 < 1
                    ? t1 + (t2 - t1) * 6 * t3
                    : 2 * t3 < 1
                        ? t2
                        : 3 * t3 < 2
                            ? t1 + (t2 - t1) * ((2 / 3) - t3) * 6
                            : t1;
            }
            return c;
    }

    private hexToRGB(h:string) {
        let r:any = 0, g:any = 0, b:any = 0;
      
        // 3 digits
        if (h.length == 4) {
          r = "0x" + h[1] + h[1];
          g = "0x" + h[2] + h[2];
          b = "0x" + h[3] + h[3];
      
        // 6 digits
        } else if (h.length == 7) {
          r = "0x" + h[1] + h[2];
          g = "0x" + h[3] + h[4];
          b = "0x" + h[5] + h[6];
        }
        return {'r':+r, 'g': +g,'b': +b}
    }

    private HSLToHex(h:any,s:any,l:any):String {
        s /= 100;
        l /= 100;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r:any = 0,
            g:any = 0, 
            b:any = 0; 
      
        if (0 <= h && h < 60) {
          r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
          r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
          r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
          r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
          r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
          r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
      
        // Prepend 0s, if necessary
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        return "#" + r + g + b;
    }
    private rgbtoHex(r:number,g:number,b:number):String{
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    private rgbToHSL(r:any,g:any,b:any) {
        // Make r, g, and b fractions of 1
        r /= 255;
        g /= 255;
        b /= 255;
      
        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;
    
    // calculate hue
        if (delta == 0)
            h = 0;
            // Red is max
            else if (cmax == r)
            h = ((g - b) / delta) % 6;
            // Green is max
            else if (cmax == g)
            h = (b - r) / delta + 2;
            // Blue is max
            else
            h = (r - g) / delta + 4;

        h = Math.round(h*60);
        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;
    // Calculate lightness
        l = (cmax + cmin) / 2;
    // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return {'h': h, 's':s, 'l':l}
    }

	
}

export class Stroke{
    w = 0;
    cap = ""
    cmpd = ""
    algn =""
    dash:any = []
    fill =new Fill()
    hEnd ={len:"",type:"", wid:""}
    // len/wid:"Large(lg), Medium(med), Small(sm) "
    // type: "Arrow(arrow), Diamond(diamond), None(none), Oval(oval), Stealth(stealth), Triagle(triangle)"
    tEnd = {len:"",type:"", wid:""}
    constructor(){
        this.w = 9525;
        this.cap = "butt" //flat(butt), round, square
        this.cmpd = "sng" //single(sng), Double(dbl), ThickThin(thickThin), ThinThick(thinThick), Triple(tri)
        this.algn ="ctr"
        this.fill =new Fill()
        this.fill.fillType ="solidFill"
        this.fill.fillVal = "#000000" 
    }
}

export class ImageFill{
    private type = "tile"
    private src = ""
    private img:any
    constructor(){
        this.type = "tile"
        this.src = ""
        this.img = new Image()
    }
    set fillType(t:string){this.type = t}
    set fillSrc(s:string){this.src = s}
    set fillImg(i:any){this.img = i}
    getType():string{
        return this.type
    }
    getSrc():string{
        return this.src
    }
    getImg():any{
        return this.img
    }
}

export class Text{
    private textObj:any
    private clrMap:any
    private theme:any
    private val:any
    private font:any
    private size:any
    private clr:any
    private bold:boolean=false
    private italic:boolean=false
    private underline:boolean=false
    private strike:boolean=false
    private kerning:any
    private baseline:any
    private fill:any
    private lnSpc:any
    private spcBef:any
    private spcAft:any
    private spcAftLines:any
    private spcBefLines:any
    private algn:any
    private marL:any
    private marR:any
    private marT:any
    private marB:any
    private indent:any
    private rtl:any
    private bdr:any
    private shdw:any
    private ln:any
    private lnSpcRule:any
    private lnSpcMult:any
    private lnSpcBef:any
    private lnSpcAft:any
    private lnSpcBefLines:any
    private lnSpcAftLines:any
    private lnSpcLine:any
    private lnSpcLineRule:any
    private lnSpcLineMult:any
    private lnSpcLineBef:any
    private lnSpcLineAft:any
    private lnSpcLineBefLines:any
    private lnSpcLineAftLines:any
    private lnSpcPara:any
    private lnSpcParaRule:any
    private lnSpcParaMult:any
    private lnSpcParaBef:any
    private lnSpcParaAft:any
    private lnSpcParaBefLines:any
    private lnSpcParaAftLines:any
    private lnSpcParaLine:any
    private lnSpcParaLineRule:any
    private lnSpcParaLineMult:any
    private lnSpcParaLineBef:any
    private lnSpcParaLineAft:any
    private lnSpcParaLineBefLines:any
    private lnSpcParaLineAftLines:any
    private lnSpcParaLineAfterLines:any
}
export class Paragraph{
  align:HAlign ="left"

  marL:number = 0
  marR:number = 0
  indent:number = 0
  txtRun:TxtRun[] = []
  objP:any
  type:string = ""
  constructor(){}
  set obj(obj:any){
    this.objP = obj
    for(let el in obj['elements']){
      // paragratph properties
      if(obj['elements'][el]['name']=='a:pPr'){
        let aln = obj['elements'][el]['attributes']['algn']
        if(aln!=null){
          this.align = aln
        }
        let marL = obj['elements'][el]['attributes']['marL']
        if(marL!=null){
          this.marL = parseInt(marL)
        }
        let marR = obj['elements'][el]['attributes']['marR']
        if(marR!=null){
          this.marR = parseInt(marR)
        }
        let indent = obj['elements'][el]['attributes']['indent']
        if(indent!=null){
          this.indent = parseInt(indent)
        }
        
      }
      // text runs
      if(obj['elements'][el]['name']=='a:r'){
        let txtRun = new TxtRun()
        for(let el2 in obj['elements'][el]['elements']){
          if(obj['elements'][el]['elements'][el2]['name']=='a:rPr'){
            let rPr = obj['elements'][el]['elements'][el2]
            let lang = rPr['attributes']['lang']
            if(lang!=null){
              txtRun.lang = lang
            }
            let b = rPr['attributes']['b']
            if(b!=null){
              txtRun.bold = true
            }
            let i = rPr['attributes']['i']
            if(i!=null){
              txtRun.italic = true
            }
            let u = rPr['attributes']['u']
            if(u!=null){
              txtRun.underline = true
            }
            let strike = rPr['attributes']['strike']
            if(strike!=null){
              txtRun.strike = true
            }
            let baseline = rPr['attributes']['baseline']
            if(baseline!=null){
              txtRun.baseline = parseInt(baseline)
            }
            let sz = rPr['attributes']['sz']
            if(sz!=null){
              txtRun.size = parseInt(sz)/100
            }
            let font = rPr['attributes']['latin']
            if(font!=null){
              txtRun.font = font
            }
            let fill = getbyPath(rPr, 'a:solidFill')
            if(fill!=null){
              txtRun.fill = new Fill(fill)
            }
            for (let el3 in rPr['elements']){
              if(rPr['elements'][el3]['name']=='a:latin'){
                let font = rPr['elements'][el3]['attributes']['typeface']
                if(font!=null){
                  txtRun.font = font
                }
              }
            }
          }
          if(obj['elements'][el]['elements'][el2]['name']=='a:br'){
            txtRun.txt += '\n'
          }
          if(obj['elements'][el]['elements'][el2]['name']=='a:tab'){
            txtRun.txt += '\t'
          }
          if(obj['elements'][el]['elements'][el2]['name']=='a:lnBrk'){
            txtRun.txt += '\n'
          }
          if(obj['elements'][el]['elements'][el2]['name']=='a:t'){
            if('elements' in obj['elements'][el]['elements'][el2]){
              let txt = obj['elements'][el]['elements'][el2]['elements'][0]['text']
              if(txt!=null){
                txtRun.txt += txt
              }
              let txtType = obj['elements'][el]['elements'][el2]['elements'][0]['type']
              if(txtType!=null){
                this.type= txtType
              }
            }
          }

        }
        this.txtRun.push(txtRun)
      }
    
    
    }
  }
}
export class TxtRun{
  bold:boolean = false
  italic:boolean = false
  underline:boolean = false
  strike:boolean = false
  kerning:number = 0
  baseline:number = 0
  lang:string = ""
  fill:Fill|undefined
  size:number = 0
  font:string = ""
  txt:string = ""
  constructor(){
  }
}


