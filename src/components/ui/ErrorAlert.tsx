interface ErrorAlertProps {
  message: string;
  type?: 'error' | 'success';
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, type = 'error' }) => (
  <div
    style={{
      backgroundColor: type === 'error' ? '#2A1010' : '#0F1F10',
      borderColor: type === 'error' ? '#7f1d1d' : '#14532d',
      color: type === 'error' ? '#fca5a5' : '#86efac',
      paddingInline: '0.75rem',
      paddingBlock:'1.5rem',

      margin:'1rem'
    }}
    className="rounded-xl border text-sm font-medium mb-4"
  >
    {message}
  </div>
);

export default ErrorAlert;