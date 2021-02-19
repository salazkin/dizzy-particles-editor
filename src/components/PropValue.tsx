import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfigValue, updateInputValue } from '../actions';

let prvValue = null;

const PropValue: React.FC<{ configKey: string; }> = props => {

    const [width, setWidth] = useState(0);

    const strValue = useSelector((state: any) => state.config.inputValues[props.configKey]);

    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLElement>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const rect = labelRef.current!.getBoundingClientRect();
        setWidth(rect.width);
    }, [strValue]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(updateInputValue({ id: props.configKey, value: event.target.value }));
    };

    const onBlur = (event: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(updateConfigValue({ id: props.configKey, value: event.target.value }));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            inputRef.current.blur();
        }
        if (event.key === "Escape") {
            inputRef.current.value = prvValue;
            inputRef.current.blur();
        }
    };

    const onFocus = (event: React.ChangeEvent<HTMLInputElement>): void => {
        prvValue = event.target.value;
    };

    return (
        <span className={"input-container"}>
            <span ref={labelRef} className="prop-dummy-value prop-font" >{strValue}</span>
            <input
                ref={inputRef}
                value={strValue}
                className={"input-value prop-font"}
                style={{ width: width + 3 }}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
            />
        </span>
    );
};

export default PropValue;


