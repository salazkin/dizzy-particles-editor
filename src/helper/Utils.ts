const hexToRgb = (color: string): number[] => {
    let arr: number[] = [];
    for (let i = 2; i >= 0; i--) {
        let c = color.substring(color.length - i * 2 - 2, color.length - i * 2);
        arr.push(parseInt(c, 16))
    }
    return arr;
}

const rgbToHex = (arr: number[], prefix: string): string => {
    return prefix + arr.map(value => hexValue(value)).join("");
}

const hexValue = (value: number): string => {
    return ("0" + value.toString(16)).slice(-2);
}

const clampValue = (min: number, max: number, value: number): number => {
    min = min || value;
    return (max !== undefined) ? Math.min(max, Math.max(min, value)) : Math.max(min, value);
}

const removeWhiteSpace = (str: string): string => {
    return str.replace(/\s/g, "");
}

const isNumber = (value: any): boolean => {
    return !isNaN(value);
}

const isValidColor = (value: string): boolean => {
    return /^((0x){0,1}|#{0,1})([0-9A-F]{6})$/i.test(value);
}

export default {
    hexToRgb, rgbToHex, clampValue, isNumber, removeWhiteSpace, isValidColor
}
