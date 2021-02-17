import { UPDATE_CONFIG_VALUE, UPDATE_INPUT_VALUE } from "./types";

export type VALUE_PAYLOAD = {
    id: string;
    value: string;
};


export const updateInputValue = (payload: VALUE_PAYLOAD) => ({ type: UPDATE_INPUT_VALUE, payload });
export const updateConfigValue = (payload: VALUE_PAYLOAD) => ({ type: UPDATE_CONFIG_VALUE, payload });
