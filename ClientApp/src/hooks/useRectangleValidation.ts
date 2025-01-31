import { useState } from 'react';

export const useRectangleValidation = () => {
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const validateRectangle = async (width: number, height: number) => {
        setIsValidating(true);
        setValidationError(null);

        try {
            const response = await fetch('/api/rectangle/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ width, height }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setValidationError(errorData.message || 'Validation failed');
            }
        } catch (error) {
            setValidationError('Failed to validate rectangle dimensions');
        } finally {
            setIsValidating(false);
        }
    };

    return {
        validateRectangle,
        validationError,
        isValidating,
    };
};