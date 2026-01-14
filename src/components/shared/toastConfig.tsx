// toastConfig.tsx
import toast, { Toaster, ToastBar } from 'react-hot-toast';

export const RubinosToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        borderRadius: '1rem',
        background: '#D4CCC0', // same as input bg
        border: '2px solid #b8aea0',
        padding: '16px 24px',
        color: '#3d5055',
        fontFamily: "font-head",
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    }}
    gutter={12}
    containerStyle={{
      top: 24,
      right: 24,
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <div className="flex items-center gap-3">
            {icon}
            <span>{message}</span>
          </div>
        )}
      </ToastBar>
    )}
  </Toaster>
);

export const toastSuccess = (message: string) => {
  toast.success(message, {
    icon: '✓',
    style: {
      background: '#D4CCC0', // light green for success
      color: '#D4CCC0',
      border: '2px solid #38a169',
      borderRadius: '1rem',
      padding: '16px 24px',
      fontFamily: "font-head",
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    icon: '⚠️',
    style: {
      background: '#D4CCC0', // light red for error
      color: '#D4CCC0',
      border: '2px solid #e53e3e',
      borderRadius: '1rem',
      padding: '16px 24px',
      fontFamily: "font-head",
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  });
};
