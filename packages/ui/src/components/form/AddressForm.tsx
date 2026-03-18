import * as React from "react";
import { FieldState } from "./FieldState";

export type AddressFormValue = {
  contactName: string;
  phone: string;
  area: string;
  street: string;
  landmark?: string;
  notes?: string;
};

export type AddressFormProps = {
  value: AddressFormValue;
  onChange: (value: AddressFormValue) => void;
  className?: string;
};

export function AddressForm({
  value,
  onChange,
  className = "",
}: AddressFormProps) {
  const update = (key: keyof AddressFormValue, nextValue: string) => {
    onChange({
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <div className={mimo-address-form .trim()}>
      <div className="mimo-address-form__grid">
        <div className="mimo-field">
          <label className="mimo-label" htmlFor="address-contact-name">
            Contact name
          </label>
          <input
            id="address-contact-name"
            className="mimo-input"
            value={value.contactName}
            onChange={(event) => update("contactName", event.target.value)}
            placeholder="Asha Mushi"
          />
        </div>

        <div className="mimo-field">
          <label className="mimo-label" htmlFor="address-phone">
            Contact phone
          </label>
          <input
            id="address-phone"
            className="mimo-input"
            value={value.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+255 712 345 678"
          />
        </div>

        <div className="mimo-field">
          <label className="mimo-label" htmlFor="address-area">
            Area / ward
          </label>
          <input
            id="address-area"
            className="mimo-input"
            value={value.area}
            onChange={(event) => update("area", event.target.value)}
            placeholder="Masaki"
          />
        </div>

        <div className="mimo-field">
          <label className="mimo-label" htmlFor="address-street">
            Street / block
          </label>
          <input
            id="address-street"
            className="mimo-input"
            value={value.street}
            onChange={(event) => update("street", event.target.value)}
            placeholder="Chole Road"
          />
        </div>
      </div>

      <div className="mimo-field">
        <label className="mimo-label" htmlFor="address-landmark">
          Landmark
        </label>
        <input
          id="address-landmark"
          className="mimo-input"
          value={value.landmark ?? ""}
          onChange={(event) => update("landmark", event.target.value)}
          placeholder="Near the embassy roundabout"
        />
      </div>

      <div className="mimo-field">
        <label className="mimo-label" htmlFor="address-notes">
          Delivery notes
        </label>
        <textarea
          id="address-notes"
          className="mimo-textarea"
          value={value.notes ?? ""}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Gate code, floor, or pickup instructions"
          rows={4}
        />
        <FieldState tone="helper" message="Use notes for access guidance, not as the main address." />
      </div>
    </div>
  );
}
