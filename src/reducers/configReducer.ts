import Utils from "../helper/Utils";
import produce from "immer";
import { UPDATE_CONFIG_VALUE, UPDATE_INPUT_VALUE } from "../actions/types";

const configInitialState = {
    particles: { value: [5], min: 1, max: 99, isSingleValue: true },
    loop: { value: [1], isBool: true, isSingleValue: true },
    duration: { value: [1], min: 0 },
    delay: { value: [0], min: 0 },
    posStartOffsetX: { value: [0] },
    posStartOffsetY: { value: [0] },
    posEndOffsetX: { value: [0] },
    posEndOffsetY: { value: [0] },
    posControlPoint1Mag: { value: [0] },
    posControlPoint1Angle: { value: [0] },
    posControlPoint2Mag: { value: [0] },
    posControlPoint2Angle: { value: [0] },
    scaleFrom: { value: [1] },
    scaleTo: { value: [1] },
    scaleYoYo: { value: [0], isBool: true, isSingleValue: true },
    rotationSpeed: { value: [0] },
    rotationFaceDir: { value: [0], isBool: true, isSingleValue: true },
    alphaFrom: { value: [1], min: 0 },
    alphaTo: { value: [1], min: 0 },
    alphaYoYo: { value: [0], isBool: true, isSingleValue: true },
    tint: { value: ["0xffffff"], isColor: true },
    tintInterpolate: { value: [0], isBool: true, isSingleValue: true },
    additive: { value: [0], isBool: true, isSingleValue: true },
};


const getStrValue = (value: any[], isBool: boolean, isColor: boolean): string => {
    if (isColor) {
        return value.map(item => Utils.rgbToHex(Utils.hexToRgb(item), "")).join(", ");
    } else if (isBool) {
        return value[0] === 1 ? "true" : "false";
    } else {
        return value.map(item => Array.isArray(item) ? item.join("~") : item).join(",");
    }
};

for (const key in configInitialState) {
    const data = configInitialState[key];
    data.strValue = getStrValue(data.value, data.isBool, data.isColor);
}

const configReducer = (state = configInitialState, action) => {
    switch (action.type) {
        case UPDATE_INPUT_VALUE:
            return produce(state, (draft) => {
                draft[action.payload.id].strValue = action.payload.value;
            });

        case UPDATE_CONFIG_VALUE:
            let properValue = getProperValue(state[action.payload.id], action.payload.id, action.payload.value);
            if (properValue === null) {
                properValue = state[action.payload.id].value;
            }
            return produce(state, (draft) => {
                draft[action.payload.id].value = properValue;
                draft[action.payload.id].strValue = getStrValue(properValue, state[action.payload.id].isBool, state[action.payload.id].isColor);
            });

        default:
            return state;
    }
};

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
        if (data.isColor && item.color) {
            let rgb = Utils.hexToRgb(item.color);
            return Utils.rgbToHex(rgb, "0x");
        } else if (item.range !== undefined) {
            return item.range.map(value => Utils.clampValue(data.min, data.max, value));
        } else {
            return Utils.clampValue(data.min, data.max, item.num!);
        }
    });
};

type DataInfo = {
    num?: number, bool?: boolean | number, str?: string, range?: number[], color?: string;
};


const parseValues = (str: string): null | DataInfo[] => {
    let err = false;
    let arr = str.split(",").map(v => {
        let num: number | undefined;
        let bool: boolean | number | undefined;;
        let str: string | undefined;;
        let range: number[] | undefined;;
        let color: string | undefined;;

        if (Utils.isValidColor(v)) {
            color = v;
        }

        if (v.indexOf("~") !== -1) {
            let rangeParse = v.split("~");
            if (rangeParse.length > 2) {
                err = true;
            } else if (Utils.isNumber(rangeParse[0]) && Utils.isNumber(rangeParse[1])) {
                range = [Number(rangeParse[0]), Number(rangeParse[1])];
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
    return null;
};


export default configReducer;
