// const chroma = require('chroma-js');
import chroma from 'chroma-js'

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { color } from 'highcharts';

@Injectable({
  providedIn: 'root',
})
export class CustomThemeService {

  // generateMaterialPalette(primaryColor: string, accentColor: string, warnColor?: string) {
  //   const palette = {
  //     primary: this.generateColorPalette(primaryColor),
  //     accent: this.generateAccentPalette(accentColor),
  //     warn: this.generateColorPalette(warnColor || '#f44336'), // Default red for warning
  //     background: this.generateBackgroundPalette(),
  //     foreground: this.generateForegroundPalette(),
  //   };
  //   for(const [paletteName, colorPalette] of Object.entries(palette)){
  //     // this.setPaletteVaribles(paletteName, colorPalette)
  //   }
  //   return palette;
  // }

  // Generates the primary and warn palette shades and contrast
  // private generateColorPalette(color: string) {
  //   const shades = chroma.scale([chroma(color).brighten(3), color, chroma(color).darken(2)])
  //     .mode('lab')
  //     .colors(10);

  //   const contrast = shades.map((shade: any) => chroma.contrast(shade, '#fff') > 4.5 ? '#fff' : '#000');

  //   return this.formatPalette(shades, contrast);
  // }

  // Generates the accent palette (more saturated and vibrant colors)
  // private generateAccentPalette(color: string) {
  //   const accents = chroma.scale([chroma(color).saturate(2), color, chroma(color).brighten(2)])
  //     .mode('lab')
  //     .colors(10);

  //   const contrast = accents.map((acc: any) => chroma.contrast(acc, '#fff') > 4.5 ? '#fff' : '#000');

  //   return this.formatPalette(accents, contrast);
  // }

  // Helper function to format the palette
  private formatPalette(shades: any, contrast: any) {
    const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const accentKeys = ['A100', 'A200', 'A400', 'A700'];

    let palette: any = {};
    keys.forEach((key, i) => {
      palette[key] = shades[i];
    });

    accentKeys.forEach((key, i) => {
      palette[key] = shades[i + 6]; // A100 to A700 will be from the last 4 shades
    });

    palette['contrast'] = {};
    keys.forEach((key, i) => {
      palette['contrast'][key] = contrast[i];
    });

    accentKeys.forEach((key, i) => {
      palette['contrast'][key] = contrast[i + 6];
    });

    return palette;
  }

  // Background color palette (light and dark)
  // private generateBackgroundPalette() {
  //   const lightBackground = '#fafafa'; // Light default background
  //   const darkBackground = '#121212'; // Dark theme background

  //   return {
  //     light: lightBackground,
  //     dark: darkBackground,
  //     contrast: {
  //       light: chroma.contrast(lightBackground, '#000') > 4.5 ? '#000' : '#fff',
  //       dark: chroma.contrast(darkBackground, '#fff') > 4.5 ? '#fff' : '#000',
  //     },
  //   };
  // }

  // Foreground colors for text (light and dark themes)
  // private generateForegroundPalette() {
  //   return {
  //     light: '#000000', // Default foreground for light theme
  //     dark: '#ffffff',  // Default foreground for dark theme
  //   };
  // }

  // private setPaletteVaribles(paletteName: string, palette: { [key: string]: string }) {
  //   for (const [shade, color] of Object.entries(palette)) {
  //     if (shade === 'contrast') {
  //       for (const [contrastShade, contrastColor] of Object.entries(color)) {
  //         document.documentElement.style.setProperty(`--${paletteName}-contrast-${contrastShade}`, contrastColor)
  //       }
  //     } else if (color) {
  //       document.documentElement.style.setProperty(`--${paletteName}-${shade}`, color)
  //     } else if (shade === 'foreground' || shade === 'background') {
  //       for (const [shade, color] of Object.entries(palette)) {
  //         document.documentElement.style.setProperty(`--${paletteName}-${shade}`, color)
  //       }
  //     }
  //   }
  // }







  generateMaterialPalette2(primaryColor: string, accentColor: string, warnColor?: string) {
    const lightPalette = {
      primary: this.generateLightColorPalette(primaryColor),
      accent: this.generateLightAccentPalette(accentColor),
      warn: this.generateLightColorPalette(warnColor || '#f44336'),
      background: {
        light: '#fafafa', // Light theme background
        contrast: {
          light: chroma.contrast('#fafafa', '#000') > 4.5 ? '#000' : '#fff'
        }
      },
      foreground: {light: '#000000'}, // Default foreground for light theme
    };
  
    const darkPalette = {
      primary: this.generateDarkColorPalette(primaryColor),
      accent: this.generateDarkAccentPalette(accentColor),
      warn: this.generateDarkColorPalette(warnColor || '#f44336'),
      background: {
        dark: '#121212', // Dark theme background
        contrast: {
          dark: chroma.contrast('#121212', '#fff') > 4.5 ? '#fff' : '#000'
        }
      },
      foreground: {dark: '#ffffff'}, // Default foreground for dark theme
    };
  
    // Set CSS variables for both themes
    for(const [paletteName, paletteColor] of Object.entries(lightPalette)){
      this.setPaletteVaribles2('light', paletteName, paletteColor);
    }
    for(const [paletteName, paletteColor] of Object.entries(darkPalette)){
      this.setPaletteVaribles2('dark', paletteName, paletteColor);
    }
  
    return { light: lightPalette, dark: darkPalette };
  }
  private generateDarkColorPalette(color: string) {
    const shades = chroma
      .scale([chroma(color).brighten(4), chroma(color).brighten(1)]) // Light variations
      .mode('lab')
      .colors(10);
  
    const contrast = shades.map(shade => (chroma.contrast(shade, '#fff') > 4.5 ? '#fff' : '#000'));
    return this.formatPalette(shades, contrast);
  }
  
  private generateLightColorPalette(color: string) {
    const shades = chroma
      .scale([chroma(color).darken(2), chroma(color).darken(4)]) // Dark variations
      .mode('lab')
      .colors(10);
  
    const contrast = shades.map(shade => (chroma.contrast(shade, '#000') > 4.5 ? '#000' : '#fff'));
    return this.formatPalette(shades, contrast);
  }
  private generateDarkAccentPalette(color: string) {
    const accents = chroma
      .scale([chroma(color).brighten(3), chroma(color).saturate(2)]) // Light and vibrant
      .mode('lab')
      .colors(10);
  
    const contrast = accents.map(acc => (chroma.contrast(acc, '#fff') > 4.5 ? '#fff' : '#000'));
    return this.formatPalette(accents, contrast);
  }
  
  private generateLightAccentPalette(color: string) {
    const accents = chroma
      .scale([chroma(color).darken(2), chroma(color).saturate(2)]) // Dark and vibrant
      .mode('lab')
      .colors(10);
  
    const contrast = accents.map(acc => (chroma.contrast(acc, '#000') > 4.5 ? '#000' : '#fff'));
    return this.formatPalette(accents, contrast);
  }
  private setPaletteVaribles2(theme: string, paletteName: string, palette: { [key: string]: string }) {
    for (const [shade, color] of Object.entries(palette)) {
      if (shade === 'contrast') {
        for (const [contrastShade, contrastColor] of Object.entries(color)) {
          document.documentElement.style.setProperty(`--${theme}-${paletteName}-contrast-${contrastShade}`, contrastColor)
        }
      } else if (color) {
        document.documentElement.style.setProperty(`--${theme}-${paletteName}-${shade}`, color)
      }
    }
  }

}

