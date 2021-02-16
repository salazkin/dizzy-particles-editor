import Utils from "../helper/Utils";

const configReducer = (state, action) => {
    let data = {};

    switch (action.type) {
        case "INIT_CONFIG_PROP":
            data[action.id] = Object.assign({}, state[action.id], action.value);
            return Object.assign(state, data);

        case "SET_CONFIG_PROP":
            let properValue = getProperValue(state[action.id], action.id, action.value);
            if (properValue !== null) {
                data[action.id] = Object.assign({}, state[action.id], { value: properValue });
                return Object.assign(state, data)
            } else {
                return state;
            }
        default:
            return {}
    }
}

const getProperValue = (data: any, key: string, value: string): any => {
    let spaceTrimStr = Utils.removeWhiteSpace(value);

    if (spaceTrimStr.length === 0 || spaceTrimStr == " ") {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Value length error.`);
        return null;
    }

    let parse = parseValues(spaceTrimStr);

    if (!parse) {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Range parser error.`);
        return null;
    }

    if (data.isSingleValue && parse.length > 1) {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Value must be a single.`);
        return null;
    }

    if (data.isBool && parse[0].bool === undefined) {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Value must be a bool.`);
        return null;
    }

    if (data.isColor && parse.filter(item => item.color === undefined).length) {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Value is not a color.`);
        return null;
    }

    if (!data.isColor && parse.filter(item => !Utils.isNumber(item.num) && item.range === undefined).length) {
        console.warn(`Bed input value: \"${value}\" for key: [${key}]. Value is not a number.`);
        return null;
    }

    return parse.map(item => {
        if (data.isColor) {
            let rgb = Utils.hexToRgb(item.color);
            return Utils.rgbToHex(rgb, "0x");
        } else if (item.range !== undefined) {
            return item.range.map(value => Utils.clampValue(data.min, data.max, value));
        } else {

            console.log(data);

            return Utils.clampValue(data.min, data.max, item.num);
        }
    });
}

type DataInfo = {
    num: number, bool: boolean | number, str: string, range: number[], color: string
}

const parseValues = (str: string): null | DataInfo[] => {
    let err = false;
    let arr = str.split(",").map(v => {
        let num: number, bool: boolean | number, str: string, range: number[], color: string;

        if (Utils.isValidColor(v)) {
            color = v;
        }

        if (v.indexOf("~") !== -1) {
            let rangeParse = v.split("~");
            if (rangeParse.length > 2) {
                err = true;
            } else if (Utils.isNumber(rangeParse[0]) && Utils.isNumber(rangeParse[1])) {
                range = [Number(rangeParse[0]), Number(rangeParse[1])]
            } else {
                err = true;
            }

        } else if (Utils.isNumber(v)) {
            num = Number(v);
            if (num === 0 || num === 1) {
                bool = num;
            }
        } else if (v.indexOf("true") !== -1) {
            num = 1;
            bool = 1;
        } else if (v.indexOf("false") !== -1) {
            num = 0;
            bool = 0;
        } else {
            str = v;
        }
        return { num, bool, str, range, color };
    });

    if (!err) {
        return arr;
    }
}


export default configReducer;
