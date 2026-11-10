"use client";

import useCountries from "@/app/hooks/useCountries";
import Select from "react-select";

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCountries();

  return (
    <div>
      <Select
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectValue)}
        menuPortalTarget={typeof document === "undefined" ? undefined : document.body}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "var(--select-surface)",
            borderColor: "var(--select-border)",
            boxShadow: "none",
            color: "var(--select-text)",
            ":hover": { borderColor: "var(--select-border-hover)" },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 60,
            backgroundColor: "var(--select-surface)",
            color: "var(--select-text)",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 60 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "var(--select-option-selected)"
              : state.isFocused
                ? "var(--select-option-hover)"
                : "transparent",
            color: state.isSelected
              ? "var(--select-option-selected-text)"
              : "var(--select-text)",
            ":active": { backgroundColor: "var(--select-option-hover)" },
          }),
          input: (base) => ({ ...base, color: "var(--select-text)" }),
          singleValue: (base) => ({ ...base, color: "var(--select-text)" }),
          placeholder: (base) => ({ ...base, color: "var(--select-placeholder)" }),
          indicatorSeparator: (base) => ({ ...base, backgroundColor: "var(--select-border)" }),
          dropdownIndicator: (base) => ({ ...base, color: "var(--select-placeholder)" }),
          clearIndicator: (base) => ({ ...base, color: "var(--select-placeholder)" }),
        }}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.flag}</div>
            <div>
              {option.label},
              <span className="text-neutral-500 ml-1">{option.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "#f43f5e",
            primary25: "#FFE4E6",
          },
        })}
      />
    </div>
  );
};
export default CountrySelect;
