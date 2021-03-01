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
    isNumber, removeWhiteSpace, isValidColor
}
