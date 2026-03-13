interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label, type, name, value, onChange, placeholder, required = false, error,
}) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={name}
      style={{ color: '#F5F0E8' }}
      className="text-sm font-semibold tracking-wide"
    >
      {label} {required && <span style={{ color: '#E8622A' }}>*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        backgroundColor: '#1A1410',
        borderColor: error ? '#ef4444' : '#2A2118',
        color: '#F5F0E8',
        height: '56px',
        paddingLeft: '1.05rem',
        paddingRight: '1.75rem',
      }}
      className="w-full rounded-xl border text-base
        placeholder-[#8A7968] focus:outline-none transition duration-200
        focus:ring-2 focus:ring-[#E8622A] hover:border-[#8B5E3C]"
    />
    {error && (
      <p style={{ color: '#ef4444' }} className="text-xs">{error}</p>
    )}
  </div>
);

export default FormInput;