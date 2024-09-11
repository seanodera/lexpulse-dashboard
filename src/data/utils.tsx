import { extractColors} from "extract-colors";
import {FinalColor} from "extract-colors/lib/types/Color";

export interface Palette {
    vibrant: FinalColor | null;
    dominant: FinalColor | null;
    background: FinalColor | null;
    lightVibrant: FinalColor | null,
    darkVibrant: FinalColor | null,
    lightMuted: FinalColor | null,
    muted: FinalColor | null,
    darkMuted: FinalColor | null
}

export interface FinalPalette {
    background: FinalColor | null;
    textColor: FinalColor | null;
    buttonColor: FinalColor | null;
}

// Combined function to load image and extract colors
export async function extractImageColors(imageSrc: string) {
    try {
       const file = await  createFile({url: imageSrc});

        const img = URL.createObjectURL(file)

        const colors = await extractColors(img);
        console.log(colors);
        return colors;
    } catch (error) {
        console.error('Error extracting colors:', error);
        throw error; // Propagate the error to handle it in the calling function
    }
}

export async function createFile({url, name = 'image'}: { url: string, name?: string }) {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
        type: 'image/jpeg'
    };
    // ... do something with the file or return it
    return new File([data], `${name}.jpg`, metadata);
}

// Thresholds for categorization
const SATURATION_THRESHOLD = 0.6;
const LIGHTNESS_THRESHOLD_LIGHT = 0.6;
const LIGHTNESS_THRESHOLD_DARK = 0.4;

function categorizeColor(color: FinalColor): string {
    const { lightness, saturation } = color;

    if (saturation > SATURATION_THRESHOLD) {
        if (lightness > LIGHTNESS_THRESHOLD_LIGHT) {
            return 'lightVibrant';
        } else if (lightness < LIGHTNESS_THRESHOLD_DARK) {
            return 'darkVibrant';
        } else {
            return 'vibrant';
        }
    } else {
        if (lightness > LIGHTNESS_THRESHOLD_LIGHT) {
            return 'lightMuted';
        } else if (lightness < LIGHTNESS_THRESHOLD_DARK) {
            return 'darkMuted';
        } else {
            return 'muted';
        }
    }
}


export function getColorPalette(colors: FinalColor[]): Palette {
    // Helper function to sort colors by a specific property
    function sortBy(property: keyof FinalColor) {
        // @ts-ignore
        return colors.slice().sort((a, b) => b[property] - a[property]);
    }
    const palette: Palette = {
        dominant:null,
        background: null,
        lightVibrant: null,
        vibrant: null,
        darkVibrant: null,
        lightMuted: null,
        muted: null,
        darkMuted: null
    };

    // Select dominant color based on area (largest area)
   palette.dominant = sortBy('area')[0] || null;

    // Select vibrant color based on saturation and lightness
    palette.vibrant = sortBy('saturation')[0] || null;

    // Select background color based on lightness (lightest color)
    palette.background = sortBy('lightness')[0] || null;


// Categorize colors
colors.forEach(color => {
    const category = categorizeColor(color);
    // Select the color for each category with the highest properties
    // @ts-ignore
    if (!palette[category] || (category === 'vibrant' && color.saturation > (palette[category] as Color).saturation)) {
        // @ts-ignore
        palette[category] = color;
    }
});

return palette;
}

// Utility function to calculate luminance
export function luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Function to calculate contrast ratio between two colors
export function contrastRatio(color1: FinalColor, color2: FinalColor): number {
    const lum1 = luminance(color1.red, color1.green, color1.blue);
    const lum2 = luminance(color2.red, color2.green, color2.blue);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}