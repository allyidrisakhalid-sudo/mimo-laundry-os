import * as React from "react";
import { FieldState, FieldStateTone } from "./FieldState";

export type PhoneInputTZProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: React.ReactNode;
  stateTone?: FieldStateTone;
  stateMessage?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function PhoneInputTZ({
  id = "mimo-phone-input",
  label = "Phone number",
  value,
  onChange,
  helperText = "Enter a Tanzanian mobile number without the leading zero.",
  stateTone = "helper",
  stateMessage,
  disabled = false,
  className = "",
}: PhoneInputTZProps) {
  const normalized = value.replace(/\D/g, "").slice(0, 9);

  return (
    <div className={`mimo-field ${className}`.trim()}>
      <label className="mimo-label" htmlFor={id}>
        {label}
      </label>

      <div className={`mimo-phone ${disabled ? "mimo-phone--disabled" : ""}`.trim()}>
        <span className="mimo-phone__prefix">+255</span>
        <input
          id={id}
          className="mimo-input mimo-phone__input"
          inputMode="numeric"
          autoComplete="tel-national"
          value={normalized}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 9))}
          placeholder="712345678"
          disabled={disabled}
          aria-describedby={`${id}-state`}
        />
      </div>

      <div id={`${id}-state`}>
        <FieldState
          tone={stateMessage ? stateTone : "helper"}
          message={stateMessage ?? helperText}
          className="mimo-field__state"
        />
      </div>
    </div>
  );
}
