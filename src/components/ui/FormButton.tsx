interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({
  type = 'button', children, loading = false, disabled = false, onClick,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      backgroundColor: '#E8622A',
      height: '56px',
      color: '#ffffff',
    }}
    className="w-full px-6 mt-3 rounded-xl font-bold text-base
      transition duration-200 tracking-wide
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:opacity-90 active:opacity-80
      shadow-lg"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
            7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Processing...
      </span>
    ) : children}
  </button>
);

export default FormButton;