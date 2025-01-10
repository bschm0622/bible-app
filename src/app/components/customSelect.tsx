import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderWidth: '2px',
    borderColor: '#ccc',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    padding: '0.5rem 1rem',
    backgroundColor: state.isSelected ? '#0d6efd' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#333',
    fontWeight: state.isSelected ? '600' : '400',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  }),
};

const CustomSelect = () => {
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ];

  return (
    <div className="max-w-xs mx-auto">
      <div className="card p-4 bg-base-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Select a Framework</h2>
        <Select options={options} styles={customStyles} className="react-select" />
      </div>
    </div>
  );
};

export default CustomSelect;
