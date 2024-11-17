import { BGProps, BGtype } from './interface';

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
        
        let color = new Color(obj['a:solidFill'])
        ClrObj.val = color.getColor()
    }


    // gradFill
    if('a:gradFill' in obj){
        ClrObj.val = {gradient:[], linang:''}
        let gradStopObj = getNested(obj, 'a:gradFill','a:gsLst','a:gs')
        for(let gs in gradStopObj){
            let clrClass = new Color(gradStopObj[gs])
            let clr = clrClass.getColor()
            let gsPos = gradStopObj[gs]['@_pos']
            ClrObj.val.gradient.push({pos:gsPos,clr})
        }
        ClrObj.val.linang = parseInt(getNested(obj, 'a:gradFill','@_ang'))/10000        
    }




    // blipFill


    // pattFill


    return ClrObj

}



export function getBG(bb:object):BGProps{
    let bg:BGProps = Object.create(bb)
    return bg
}

export class Bg {
    type = ''
    val:any

    constructor(a?:any){
        if(typeof(a)=='object'){
            if('p:bgPr'in a){               
                let fill = new Fill(a['p:bgPr'])
                this.type = fill.type
                this.val = fill.val
            }
            if('p:bgRef'in a){
                let color = new Color(a['p:bgRef'])
                this.type = color.clr.type
                this.val = color.getColor()
            }
        }
    }
}

export class Fill {
    type:BGtype='noFill'
    val:any;
    constructor(a?:any){
        if (typeof(a)=='object'){

            // solidFill
            if('a:solidFill' in a){ 
                this.type='solidFill'       
                let color = new Color(a['a:solidFill'])
                this.val = color.getColor()
            }

            // gradFill

            if('a:gradFill' in a){
                this.val = {gradient:[], linang:''}
                let gradStopObj = getNested(a, 'a:gradFill','a:gsLst','a:gs')
                for(let gs in gradStopObj){
                    let clrClass = new Color(gradStopObj[gs])
                    let clr = clrClass.getColor()
                    let gsPos = gradStopObj[gs]['@_pos']
                    this.val.gradient.push({pos:gsPos,clr})
                }
                if(getNested(a, 'a:gradFill','@_ang') !='undefined'){
                    this.val.linang = parseInt(getNested(a, 'a:gradFill','@_ang'))/10000   
                }
                     
            }

            // patternFill (TBD)



            // ImageFill 
            if('a:blipFill' in a){
                this.type = 'imageFill'
                this.val = {imgPath:'', stretch:'', tile:''}
                if(getNested(a, 'a:blipFill','a:blip','r:embed') !='undefined'){
                    this.val.imgPath = getNested(a, 'a:blipFill','a:blip','r:embed') 
                }
                if(getNested(a, 'a:blipFill','a:blip','r:link') !='undefined'){
                    this.val.imgPath = getNested(a, 'a:blipFill','a:blip','r:link') 
                }

            }




        }
        if(typeof(a)=='string'){
            if(a=='noFill'){this.type= a}
            if(a=='solidFill'){this.type=a}
            if(a=='gradientFill'){this.type=a}
            if(a=='patternFill'){this.type=a}
            if(a=='imageFill'){this.type=a}            
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
	clr:any={type:'', val:''}
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
        'threedlightshadow':'#C0C0C0','threedshadow':'#808080','window':'#FFFFFF','windowframe':'#000000','windowtext':'#000000'}

	constructor(obj?:any){
		if(typeof(obj) !='undefined'){
			if('a:hslClr' in obj){
				this.a_hslClr = obj['a:hslClr'];
				let hsl={hue:0, saturation:0, lightness:0}
				if('@_hue'in this.a_hslClr){hsl.hue = parseInt(this.a_hslClr['@_hue'])/10000}
				if('@_sat'in this.a_hslClr){hsl.saturation = parseInt(this.a_hslClr['@_sat'])}
				if('@_lum'in this.a_hslClr){hsl.lightness =parseInt(this.a_hslClr['@_lum'])}
				if(this.a_hslClr['a:hue']in this.a_hslClr){hsl.hue = this.a_hslClr['a:hue']['@_val']}
				this.clr.type='hsl'
				this.clr.val = hsl
			}
			if('a:prstClr' in obj){
                this.p_prstClr= obj['a:prstClr'];
                this.clr.type='preset'
                this.clr.val=this.p_prstClr['@_val']
            }
            if('a:sysClr' in obj){
                this.p_sysClr= obj['a:sysClr'];
                this.clr.type='sysclr'
                this.clr.val=this.p_sysClr['@_val']
            }

			if('a:schemeClr' in obj){
                this.p_schemeClr= obj['a:schemeClr'];
                this.clr.type= 'theme'
                this.clr.val = this.p_schemeClr['@_val']
            }
            if('a:srgbClr' in obj){
                this.p_srgbClr= obj['a:srgbClr']
                this.clr.type= 'hex'
                this.clr.val = this.p_srgbClr['@val']
            }
			if('a:scrgbClr' in obj){
                this.p_scrgbClr= obj['a:scrgbClr']
                this.clr.type ='rgb'
                let r = parseInt(this.p_scrgbClr['p:rgb']['@_r'])
                let g =  parseInt(this.p_scrgbClr['p:rgb']['@_g'])
                let b =  parseInt(this.p_scrgbClr['p:rgb']['@_b'])
                this.clr.val = [r,g,b]
            }
			
			
		}	
	}

    getColor(){
        if(this.clr.type=='hsl'){return this.HSLToHex(this.clr.val.h, this.clr.val.s, this.clr.val.l)}
        if(this.clr.type=='preset'){return this.presetColors[this.clr.val.toLowerCase()]}
        if(this.clr.type=='sysclr'){return this.systemColors[this.clr.val.toLowerCase()]}
        if(this.clr.type=='hex'){return this.clr.val}
        if(this.clr.type=='theme'){return this.clr.val}
        if(this.clr.type=='rgb'){return this.rgbtoHex(this.clr.type.r,this.clr.type.g, this.clr.type.b)}
    }

	hsl_rgb(h:any, s:any, l:any) {
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

    HSLToHex(h:any,s:any,l:any):string {
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
    rgbtoHex(r:number,g:number,b:number){
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }
    presetToHex(){

    }

	
}

