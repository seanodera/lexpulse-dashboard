
import {contrastRatio, getColorPalette, luminance} from "@/data/utils";
import {FinalColor} from "extract-colors/lib/types/Color";
import {FinalPalette} from "@/data/types";



const MIN_CONTRAST = 4.5; // Minimum contrast ratio for text to background

function getBestContrastColor(baseColor: FinalColor, candidates: FinalColor[]):FinalColor {
    let bestContrastColor: FinalColor | null = null;
    let bestContrastRatio = 0;

    candidates.forEach(candidate => {
        const ratio = contrastRatio(baseColor, candidate);
        if (ratio > MIN_CONTRAST && ratio > bestContrastRatio) {
            bestContrastRatio = ratio;
            bestContrastColor = candidate;
        }
    });

    return bestContrastColor!;
}

export function getFinalPalette(colors: FinalColor[]): FinalPalette {
    // First, categorize the colors
    const categorizedColors = getColorPalette(colors); // Uses the previous function

    const backgroundCandidates = [categorizedColors.darkMuted, categorizedColors.muted].filter(Boolean) as FinalColor[];
    const vibrantCandidates = [categorizedColors.vibrant, categorizedColors.lightVibrant, categorizedColors.darkVibrant].filter(Boolean) as FinalColor[];

    let background: FinalColor | null = null;
    let textColor: FinalColor | null = null;
    let buttonColor: FinalColor | null = null;

    // 1. Determine background color (muted, dark muted)
    if (backgroundCandidates.length > 0) {
        background = backgroundCandidates.sort((a, b) => b.area - a.area)[0];
    }

    // 2. Determine text color (contrast with background)
    if (background) {
        textColor = getBestContrastColor(background, vibrantCandidates);
    }

    // 3. Determine button color (a vibrant color that stands out)
    if (vibrantCandidates.length > 0) {
        buttonColor = vibrantCandidates[0]; // Choose the most vibrant color
    }

    // Fallback: If no contrasting text color is found, use a default white/black based on background luminance
    if (!textColor && background) {
        const backgroundLuminance = luminance(background.red, background.green, background.blue);
        textColor = backgroundLuminance > 0.5
            ? { red: 0, green: 0, blue: 0, hex: "#000000", area: 1, intensity: 1, hue: 0, saturation: 1, lightness: 0 }
            : { red: 255, green: 255, blue: 255, hex: "#ffffff", area: 1, intensity: 1, hue: 0, saturation: 1, lightness: 1 };
    }

    return {
        background,
        textColor,
        buttonColor
    };
}