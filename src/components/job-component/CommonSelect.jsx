import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
export const CommonSelect = ({
  handleChange,
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
        color: isLightMode ? "black" : "e3f2fd",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isLightMode ? "black" : "white",
      fontSize: fontSize || "auto",
    }),
  };

  const selectOptions = options?.map((option) => ({
    value: option?.id,
    label: option?.name,
  }));

  return (
    <Select
      styles={customStyles}
      options={options}
      placeholder={placeholder}
      value={options?.find((option) => option.value === value) || ""}
      isDisabled={disabled}
      onChange={(selectedOption) => {
        if (selectedOption === null) {
          // Cross button was clicked
          if (handleClear) {
            handleClear();
          } else {
            handleChange({ target: { name, value: "" } });
          }
        } else {
          // Regular selection change
          handleChange({
            target: { name, value: selectedOption.value },
          });
        }
      }}
      name={name}
      isClearable={!hideBtn}
    />
  );
};
