import React from 'react';
import Select, { StylesConfig } from 'react-select';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  onChange: (selectedOptions: any) => void;
}

const customStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    borderWidth: '2px',
    borderColor: '#D8DEE9', // base-300 color for the border
    borderRadius: '0.375rem', // Rounded corners
    padding: '0.25rem 0.75rem',
    backgroundColor: '#ECEFF4', // base-100 color for background
    boxShadow: 'none',
    minHeight: 'auto',
    display: 'flex',
    alignItems: 'center',
    transition: 'border-color 0.3s ease', // Smooth transition on focus
    ':hover': {
      borderColor: '#88C0D0', // primary-focus color on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#ECEFF4', // base-100 color for menu background
    borderColor: '#D8DEE9', // base-300 for menu border
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0.5rem 1rem',
    backgroundColor: state.isSelected ? '#8FBCBB' : '#ECEFF4', // primary color for selected option
    color: state.isSelected ? '#ECEFF4' : '#2E3440', // base-content color for normal option
    fontWeight: state.isSelected ? '600' : '400',
    ':hover': {
      backgroundColor: '#88C0D0', // primary-focus color on hover
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#8FBCBB', // primary color for multi values
    color: '#ECEFF4', // base-100 color for multi-value text
    borderRadius: '0.375rem',
    padding: '0.25rem 0.75rem',
    margin: '0.125rem',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#ECEFF4', // base-100 color for multi-value label
    fontWeight: '600',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#ECEFF4',
    ':hover': {
      backgroundColor: '#BF616A', // error color for remove button hover
    },
  }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  return (
    <Select
      isMulti
      options={options}
      styles={customStyles}
      onChange={onChange}
      className="react-select-container"
      classNamePrefix="react-select" // To add custom prefixes to class names
    />
  );
};

export default CustomSelect;
