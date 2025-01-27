import { Injectable } from "@angular/core";
import tinycolor from "tinycolor2";


// export interface MaterialPalette {
//     [key: string]: {
//         key: string,
//         hex: string,
//         isLight: boolean
//     };
// }
type RGBA = tinycolor.ColorFormats.RGBA;



@Injectable({
    providedIn: 'root'
})
export class DynamicThemeService {

    multiply(rgb1: RGBA, rgb2: RGBA) {
        rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
        rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
        rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);
        return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
    }
    MIX_AMOUNTS_PRIMARY: { [key: number]: any } = {
        50: [true, 12],
        100: [true, 30],
        200: [true, 50],
        300: [true, 70],
        400: [true, 85],
        500: [true, 100],
        600: [false, 87],
        700: [false, 70],
        800: [false, 54],
        900: [false, 25]
    };

    MIX_AMOUNTS_SECONDARY: { [key: string]: any } = {
        A100: [15, 80, 65],
        A200: [15, 80, 55],
        A400: [15, 100, 45],
        A700: [15, 100, 40]
    };
    getPalette(color: string): any {
        const baseLight = tinycolor('#ffffff');
        const baseDark = this.multiply(tinycolor(color).toRgb(), tinycolor(color).toRgb());
        const [, , , baseTriad] = tinycolor(color).tetrad();

        const primary = Object.keys(this.MIX_AMOUNTS_PRIMARY)
            .map((k: any) => {
                const [light, amount] = this.MIX_AMOUNTS_PRIMARY[k];
                return [k, tinycolor.mix(light ? baseLight : baseDark, tinycolor(color), amount)] as [string, tinycolor.Instance];
            });

        const accent = Object.keys(this.MIX_AMOUNTS_SECONDARY)
            .map(k => {
                const [amount, sat, light] = this.MIX_AMOUNTS_SECONDARY[k];
                return [k, tinycolor.mix(baseDark, baseTriad, amount)
                    .saturate(sat).lighten(light)] as [string, tinycolor.Instance];
            });

        return [...primary, ...accent].reduce((acc: any, [k, c]) => {
            acc[k] = c.toHexString();
            return acc;
        }, {});
    }
    getTextColor(color: string){
        return `$${tinycolor(color).isLight() ? '#000000' : '#ffffff'}`;
    }

    generatePalette(primary: string, accent: string, warn: string) {
        let palettePrimary = this.getPalette(primary);
        let contrastPrimary = {
            main: this.getTextColor(primary),
            lighter: this.getTextColor(palettePrimary[100]),
            darker: this.getTextColor(palettePrimary[800])
        }
        palettePrimary.contrast = contrastPrimary

        let paletteAccent = this.getPalette(accent);
        let contrastAccent = {
            main: this.getTextColor(accent),
            lighter: this.getTextColor(paletteAccent[100]),
            darker: this.getTextColor(paletteAccent[800])
        }
        paletteAccent.contrast = contrastAccent

        let paletteWarn = this.getPalette(warn);
        let contrastWarn = {
            main: this.getTextColor(warn),
            lighter: this.getTextColor(paletteWarn[100]),
            darker: this.getTextColor(paletteWarn[800])
        }
        paletteWarn.contrast = contrastWarn

        let paletteConfig = {primary: palettePrimary, accent: paletteAccent, warn: paletteWarn}

        for(const [paletteName, palette] of Object.entries(paletteConfig)){
            this.setPaletteVar(paletteName, palette)
        }
    }

    setPaletteVar(paletteName: string, palette: any){
        // for(const [shade, color] of Object.entries(palette)){
        //     if(shade === 'contrast' && color){
        //         for(const[contrastShade, contrastColor] of Object.entries(color)){
        //             document.documentElement.style.setProperty(`--${paletteName}-${contrastShade}`, contrastColor)
        //         }
        //     }else if(typeof(color)==='string'){
        //         document.documentElement.style.setProperty(`--${paletteName}-${shade}`, color)
        //     }
        // }
        document.documentElement.style.setProperty(`--${paletteName}-lighter`, palette[200])
        document.documentElement.style.setProperty(`--${paletteName}-darker`, palette[800])
        document.documentElement.style.setProperty(`--${paletteName}-main`, palette[500])
        document.documentElement.style.setProperty(`--${paletteName}-200`, palette[500])
    }
}