
import * as React from 'react';
import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatPortuguesePhone, isValidPortuguesePhone } from '@/utils/phoneFormatter';
import { cn } from '@/lib/utils';

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, message?: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, onValidationChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPortuguesePhone(e.target.value);
      onChange?.(formatted);
      
      if (onValidationChange) {
        const validation = isValidPortuguesePhone(formatted);
        onValidationChange(validation.isValid, validation.message);
      }
    };

    const validation = isValidPortuguesePhone(value);
    const hasError = value.length > 0 && !validation.isValid;

    return (
      <Input
        ref={ref}
        className={cn(
          className,
          hasError && "border-red-500 focus-visible:ring-red-500"
        )}
        value={value}
        onChange={handleChange}
        placeholder="9XX XXX XXX"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
