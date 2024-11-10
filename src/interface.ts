export type Coord = number | '${number}%' //for inches or in % 
export interface Position {x?: Coord,y?: Coord,h?: Coord,w?: Coord}
export interface HueClr {attr_hue?: number,attr_sat?: Coord,attr_lum?: Coord}
export interface RGB {r?: number,g?: Coord,b?: Coord}
export type HexColor = string
export interface clrProps {alpha?:Coord}
export interface gsLstProps{pos?:string, fill?:ClrProps}
export interface LinGrad{attr_ang:string, attr_scaled:string}
export interface FillProps{fill?:HexColor}
export type ThemeColor = 'tx1' | 'tx2' | 'bg1' | 'bg2' | 'accent1' | 'accent2' | 'accent3' | 'accent4' | 'accent5' | 'accent6'
export type Color = HexColor | ThemeColor
export type HAlign = 'left' | 'center' | 'right' | 'justify'
export type VAlign = 'top' | 'middle' | 'bottom'
export type BGtype = 'noFill'| 'solidFill'|'gradFill'|'patternFill'


// background
export interface BGProps{
	'p:bgPr'?:FillProps,
	'p:bgRef'?:ClrProps,
	attr_bwMode: string,
}
export interface BackgroundProps{}
export interface BackgroundRefProsp{}


// style Properties
export interface FillProps{
	blipFill?:ImgFillProps,
	gradFill?:GradFillProps,
	noFill?:'',
	solidFill:ClrProps,
	pattFill:PatternFillProps
}
export interface ClrProps {
	hslClr?:HueClr,
	prstClr?:string,
	schemeClr?:string,
	scrgbClr?:RGB,
	srgbClr?:string,
	sysClr?:string
}
export interface GradFillProps{
	gsLst:[gsLstProps],
	lin:LinGrad,
	path:'',//todo
	tileRect:'',//todo
	attr_flip?:string,
	attr_rotWithShape?:string
}
export interface ImgFillProps{}
export interface PatternFillProps{}
// Shape properties
export interface ShapeProp{
	id: string | number,
	name:string,
	pos:Position,
	prstGeom?:string,//todo
	custGeom?:string,//todo
	effect?:string //todo
	solidFill?:ClrProps,
	gradFill?:GradFillProps
	pattFill?:string //todo
	imgFill?:string,//todo
	shadow?:ShadowProps,
	border?:BorderProps,
	text?:TextProps
}

export interface ShapeStyle{}
export interface TextShape{}

export interface ShadowProps {
	/**
	 * shadow type
	 * @default 'none'
	 */
	type: 'outer' | 'inner' | 'none'
	/**
	 * opacity (percent)
	 * - range: 0.0-1.0
	 * @example 0.5 // 50% opaque
	 */
	opacity?: number // TODO: "Transparency (0-100%)" in PPT // TODO: deprecate and add `transparency`
	/**
	 * blur (points)
	 * - range: 0-100
	 * @default 0
	 */
	blur?: number
	/**
	 * angle (degrees)
	 * - range: 0-359
	 * @default 0
	 */
	angle?: number
	/**
	 * shadow offset (points)
	 * - range: 0-200
	 * @default 0
	 */
	offset?: number // TODO: "Distance" in PPT
	/**
	 * shadow color (hex format)
	 * @example 'FF3399'
	 */
	color?: HexColor
	/**
	 * whether to rotate shadow with shape
	 * @default false
	 */
	rotateWithShape?: boolean
}
export interface BorderProps {
	/**
	 * Border type
	 * @default solid
	 */
	type?: 'none' | 'dash' | 'solid'
	/**
	 * Border color (hex)
	 * @example 'FF3399'
	 * @default '666666'
	 */
	color?: HexColor

	// TODO: add `transparency` prop to Borders (0-100%)

	// TODO: add `width` - deprecate `pt`
	/**
	 * Border size (points)
	 * @default 1
	 */
	pt?: number
}
export interface TextProps {

}

// extention List
export interface extList{}
// Non visual properties
export interface NvShapeProps{}
