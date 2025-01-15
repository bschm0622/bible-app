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
    borderColor: '#ccc',
    borderRadius: '0.5rem', // Rounded corners for the input box
    padding: '0.25rem 0.5rem',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    minHeight: 'auto',
    display: 'flex',
    alignItems: 'center',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0.5rem 1rem',
    backgroundColor: state.isSelected ? '#0d6efd' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#333',
    fontWeight: state.isSelected ? '600' : '400',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#0d6efd',
    color: 'white',
    borderRadius: '0.375rem',
    padding: '0.25rem 0.5rem',
    margin: '0.125rem',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    fontWeight: '600',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    ':hover': {
      backgroundColor: '#ff0000',
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
