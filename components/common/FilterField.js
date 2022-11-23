import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useId } from "react";

export default function FilterField({
  defaultValue,
  defaultValueSearch,
  options,
  setter,
}) {
  const animatedComponents = makeAnimated();

  const colorStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: "#e7e7e7",
      fontSize: "16px",
      padding: "6px",
      oveflow: "hidden",
      cursor: "pointer",
      outline: "none",
      border: "2px solid #e6e6e6",
      borderRadius: "4px",
      width: "100%",
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const blue = "#2F9ACD";
      const black = "#252525";
      const grey = "#ddd";

      return {
        ...styles,
        width: "100%",
        backgroundColor: isDisabled ? undefined : isSelected ? blue : undefined,
        color: isDisabled ? grey : black,
        cursor: isDisabled ? "not-allowed" : "pointer",
      };
    },

    multiValue: (styles) => {
      const blue = "#2F9ACD";

      return {
        ...styles,
        backgroundColor: blue,
        overflow: "unset",
        width: "100%",
      };
    },
    multiValueRemove: (styles) => ({
      ...styles,
      cursor: "pointer",
    }),
  };

  return (
    <Select
      options={options}
      components={animatedComponents}
      defaultValue={defaultValue ? defaultValue : defaultValueSearch}
      styles={colorStyles}
      instanceId={useId()}
      className="filter"
      onChange={(selectedValue) => setter(selectedValue.label)}
    />
  );
}
