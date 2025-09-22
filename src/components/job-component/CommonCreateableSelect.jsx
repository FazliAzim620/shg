import React from "react";
import { useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";

export const CommonCreateableSelect = ({
  handleChange,
  handleCustomInput,
  placeholder,
  value,
  name,
  options,
  height,
  width,
  minWidth,
  error,
  handleClear,
  hideBtn,
  fontSize,
  disabled,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: width || "100%",
      minWidth: minWidth || "100%",
      backgroundColor: isLightMode ? "#F7F9FC" : "#333",
      border: error
        ? ".0625rem solid #d32f2f"
        : ".0625rem solid rgba(231, 234, 243, .7)",
      height: height || "2.75rem",
      color: isLightMode ? "black" : "white",
      boxShadow: state.isFocused
        ? "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px"
        : "none",
      "&:hover": {
        backgroundColor: isLightMode ? "#e3f2fd" : "#444",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2196f3"
        : isLightMode
        ? "white"
        : "#333",
      color: state.isSelected ? "white" : isLightMode ? "black" : "white",
      "&:hover": {
        backgroundColor: isLightMode ? "#e3f2fd" : "#444",
        color: isLightMode ? "black" : "white",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isLightMode ? "black" : "white",
      fontSize: fontSize || "auto",
    }),
  };

  const selectOptions = options?.map((option) => ({
    value: option?.id || option?.value,
    label: option?.name || option?.label,
  }));

  const selectedOption = selectOptions?.find(
    (option) => option.value === value
  ) || {
    value,
    label: value,
  };

  return (
    <CreatableSelect
      styles={customStyles}
      options={selectOptions}
      placeholder={placeholder}
      value={selectedOption}
      isDisabled={disabled}
      onChange={(selectedOption) => {
        if (selectedOption === null) {
          handleClear?.();
          handleChange({ target: { name, value: "" } });
        } else {
          handleChange({
            target: { name, value: selectedOption.value },
          });
        }
      }}
      onCreateOption={(inputValue) => {
        // Call the custom input handler
        handleCustomInput?.(inputValue);

        handleChange({
          target: { name, value: inputValue },
        });
      }}
      name={name}
      isClearable={!hideBtn}
    />
  );
};
