import {BGtype} from './interface';
import {getNested} from './util'

export class Bg {
    type = ''
    val:any

    constructor(bgobj?:any, clrMap?:any, theme?:any){
        if(typeof(bgobj)=='object'){
            if('p:bgPr'in bgobj){               
                let fill = new Fill(bgobj['p:bgPr'], clrMap, theme)
                this.type = fill.type
                this.val = fill.val
            }
            if('p:bgRef'in bgobj){
                let color = new Color(bgobj['p:bgRef'], clrMap, theme)
                this.type = color.clr.type
                this.val = color.getColor()
            }
        }
    }
}

export class Fill {
    type:BGtype='noFill'
    val:any;
    alpha=0;
    constructor(fillObj?:any, clrMap?:any, theme?:any){
        this.type ='noFill'
        this.val ="#FFFFFF"
        this.alpha=0
        if (typeof(fillObj)=='object'){

            // solidFill
            if('a:solidFill' in fillObj){ 
                this.type='solidFill'       
                let color = new Color(fillObj['a:solidFill'], clrMap, theme)
                this.val = color.getColor()
            }

            // gradFill

            if('a:gradFill' in fillObj){
                this.type = "gradientFill"
                this.val = {gradient:[], linang:''}
                let gradStopObj = getNested(fillObj, 'a:gradFill','a:gsLst','a:gs')
                for(let gs in gradStopObj){
                    let clrClass = new Color(gradStopObj[gs], clrMap, theme)
                    let clr = clrClass.getColor()
                    let gsPos = parseInt(gradStopObj[gs]['@_pos'])/1000
                    this.val.gradient.push({pos:gsPos,clr})
                }
                if(getNested(fillObj, 'a:gradFill','a:lin','@_ang') !='undefined'){
                    // convert arc length to degrees (arc length / 60)
                    this.val.linang = parseInt(getNested(fillObj, 'a:gradFill','a:lin','@_ang'))/60000 
                }                     
            }

            // patternFill (TBD)



            // ImageFill 
            if('a:blipFill' in fillObj){
                this.type = 'imageFill'
                this.val = {imgPath:'', stretch:'', tile:''}
                if(getNested(fillObj, 'a:blipFill','a:blip','r:embed') !='undefined'){
                    this.val.imgPath = getNested(fillObj, 'a:blipFill','a:blip','r:embed') 
                }
                if(getNested(fillObj, 'a:blipFill','a:blip','r:link') !='undefined'){
                    this.val.imgPath = getNested(fillObj, 'a:blipFill','a:blip','r:link') 
                }

            }




        }
        if(typeof(fillObj)=='string'){
            if(fillObj=='noFill'){this.type= fillObj}
            if(fillObj=='solidFill'){this.type=fillObj}
            if(fillObj=='gradientFill'){this.type=fillObj}
            if(fillObj=='patternFill'){this.type=fillObj}
            if(fillObj=='imageFill'){this.type=fillObj}            
        }
    }


}

export class Color{
	a_hslClr?:any
	p_prstClr?:any
	p_schemeClr?:any
	p_scrgbClr?:any
	p_srgbClr?:any
	p_sysClr?:any
	type:string =''
    clrMap:any
    theme:any
	clr:any={type:'', val:''}
    
    lumOff:number = 0
    presetColors:any={'indianred':'#CD5C5C','lightcoral':'#F08080','salmon':'#FA8072','darksalmon':'#E9967A','lightsalmon':'#FFA07A',
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

    systemColors:any ={'activeborder':'#C0C0C0','activecaption':'#000080','appworkspace':'#808080','background':'#3A6EA5',
        'buttonface':'#C0C0C0','buttonhighlight':'#FFFFFF','buttonshadow':'#808080','buttontext':'#000000','captiontext':'#FFFFFF',
        'graytext':'#808080','highlight':'#000080','highlighttext':'#FFFFFF','inactiveborder':'#C0C0C0','inactivecaption':'#808080',
        'inactivecaptiontext':'#C0C0C0','infobackground':'#FFFFFF','infotext':'#000000','menu':'#C0C0C0','menutext':'#000000',
        'scrollbar':'#C0C0C0','threeddarkshadow':'#000000','threedface':'#C0C0C0','threedhighlight':'#FFFFFF',
        'threedlightshadow':'#C0C0C0','threedshadow':'#808080','window':'#ffffff','windowframe':'#000000','windowtext':'#000000'}

	constructor(clrObj?:any,clrMap?:any, theme?:any){
		if(typeof(clrMap) !='undefined'){this.clrMap = clrMap}
        if(typeof(theme) !='undefined'){this.theme = theme}
        if(typeof(clrObj) !='undefined'){
			if('a:hslClr' in clrObj){
				this.a_hslClr = clrObj['a:hslClr'];
				let hsl={hue:0, saturation:0, lightness:0}
				if('@_hue'in this.a_hslClr){hsl.hue = parseInt(this.a_hslClr['@_hue'])/10000}
				if('@_sat'in this.a_hslClr){hsl.saturation = parseInt(this.a_hslClr['@_sat'])}
				if('@_lum'in this.a_hslClr){hsl.lightness =parseInt(this.a_hslClr['@_lum'])}
				if('a:hue'in this.a_hslClr){hsl.hue = this.a_hslClr['a:hue']['@_val']}
                if('a:lumOff'in this.a_hslClr){this.lumOff = parseInt(this.a_hslClr['a:lumOff'])/1000}
				this.clr.type='hsl'
				this.clr.val = hsl
			}
			if('a:prstClr' in clrObj){
                this.p_prstClr= clrObj['a:prstClr'];
                this.clr.type='preset'
                this.clr.val=this.p_prstClr['@_val']
                if('a:lumOff'in this.p_prstClr){this.lumOff = parseInt(this.p_prstClr['a:lumOff']['@_val'])/1000}
            }
            if('a:sysClr' in clrObj){
                this.p_sysClr= clrObj['a:sysClr'];
                this.clr.type='sysclr'
                this.clr.val=this.p_sysClr['@_val']
                if('a:lumOff'in this.p_sysClr){this.lumOff = parseInt(this.p_sysClr['a:lumOff']['@_val'])/1000}
            }

			if('a:schemeClr' in clrObj){
                this.p_schemeClr= clrObj['a:schemeClr'];
                this.clr.type= 'theme'
                this.clr.val = this.p_schemeClr['@_val'];
                console.log(this.p_schemeClr['a:lumOff'])
                if('a:lumOff'in this.p_schemeClr){this.lumOff = parseInt(this.p_schemeClr['a:lumOff']['@_val'])/1000}
            }
            if('a:srgbClr' in clrObj){
                this.p_srgbClr= clrObj['a:srgbClr']
                this.clr.type= 'hex'
                this.clr.val = this.p_srgbClr['@_val']
                if('a:lumOff'in this.p_srgbClr){this.lumOff = parseInt(this.p_srgbClr['a:lumOff']['@_val'])/1000}
            }
			if('a:scrgbClr' in clrObj){
                this.p_scrgbClr= clrObj['a:scrgbClr']
                this.clr.type ='rgb'
                let r = parseInt(this.p_scrgbClr['p:rgb']['@_r'])
                let g =  parseInt(this.p_scrgbClr['p:rgb']['@_g'])
                let b =  parseInt(this.p_scrgbClr['p:rgb']['@_b'])
                this.clr.val = [r,g,b]
                if('a:lumOff'in this.p_scrgbClr){this.lumOff = parseInt(this.p_scrgbClr['a:lumOff']['@_val'])/1000}
            }
			
			
		}	
	}

    getColor():any{
        if(this.clr.type=='hsl'){
            return this.HSLToHex(this.clr.val.h, this.clr.val.s, this.clr.val.l + this.lumOff)
        }
        if(this.clr.type=='preset'){
            let clrVal:any = this.presetColors[this.clr.val.toLowerCase()]
            if(this.lumOff>0){                
                // convert to hex to rgb
                clrVal = this.hexToRGB(clrVal)
                // convert rgb to hsl
                clrVal = this.rgbToHSL(clrVal.r, clrVal.g, clrVal.b)
                // convert to Hex by replacing lumOff
                clrVal = this.HSLToHex(clrVal.h,clrVal.s, this.lumOff)
            }
            return clrVal
        }
        if(this.clr.type=='sysclr'){
            let clrVal:any = this.systemColors[this.clr.val.toLowerCase()]
            if(this.lumOff>0){                
                // convert to hex to rgb
                clrVal = this.hexToRGB(clrVal)
                // convert rgb to hsl
                clrVal = this.rgbToHSL(clrVal.r, clrVal.g, clrVal.b)
                // convert to Hex by replacing lumOff
                clrVal = this.HSLToHex(clrVal.h,clrVal.s, this.lumOff)
            }
            return clrVal
        }
        if(this.clr.type=='hex'){
            let clrVal:any = this.clr.val
            if(this.lumOff>0){                
                // convert to hex to rgb
                clrVal = this.hexToRGB(clrVal)
                // convert rgb to hsl
                clrVal = this.rgbToHSL(clrVal.r, clrVal.g, clrVal.b)
                // convert to Hex by replacing lumOff
                clrVal = this.HSLToHex(clrVal.h,clrVal.s, this.lumOff)
            }
            return clrVal
        }
        if(this.clr.type=='theme'){
            let themeClrName = getNested(this.theme,'a:'+this.clrMap['@_'+this.clr.val])
            let thmclr = new Color(themeClrName)
            let clrVal:any = thmclr.getColor()
            if(clrVal.length==6){
                clrVal = "#"+ clrVal
            }
            if(this.lumOff>0){                
                // convert to hex to rgb
                clrVal = this.hexToRGB(clrVal)
                // convert rgb to hsl
                clrVal = this.rgbToHSL(clrVal.r, clrVal.g, clrVal.b)
                // convert to Hex by replacing lumOff
                clrVal = this.HSLToHex(clrVal.h,clrVal.s, this.lumOff)
            }
            return clrVal
        }
        if(this.clr.type=='rgb'){
            let clrVal:any = "";
            if(this.lumOff>0){                
                // convert rgb to hsl
                clrVal = this.rgbToHSL(this.clr.type.r, this.clr.type.g, this.clr.type.b)
                // convert to Hex by replacing lumOff
                clrVal = this.HSLToHex(clrVal.h,clrVal.s, this.lumOff)
            }
            return clrVal
        }
    }

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
    private presetToHex(){

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
    fill =new Fill()
    constructor(){
        this.w = 9525;
        this.cap = "flat" //flat, round, square
        this.cmpd = "sng" //single(sng), Double(dbl), ThickThin(thickThin), ThinThick(thinThick), Triple(tri)
        this.algn ="ctr"
        this.fill =new Fill()
        this.fill.type ="solidFill"
        this.fill.val = "#000000" 
    }
}