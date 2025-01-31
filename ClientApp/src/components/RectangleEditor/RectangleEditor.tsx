import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useRectangleValidation } from '../../hooks/useRectangleValidation';
import { RectangleInfo } from '../../types';
import { ResizableRectangle } from '../ResizableRectangle/ResizableRectangle';

export const RectangleEditor: React.FC = () => {
    const [rectangle, setRectangle] = useState<RectangleInfo>({
        width: 0,
        height: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const { validateRectangle, validationError, isValidating } = useRectangleValidation();

    useEffect(() => {
        fetchInitialDimensions();
    }, []);

    const fetchInitialDimensions = async () => {
        try {
            const response = await fetch('/api/rectangle');
            const data = await response.json();
            setRectangle(data);
        } catch (error) {
            console.error('Failed to fetch initial dimensions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResize = async (newWidth: number, newHeight: number) => {
        setRectangle({ width: newWidth, height: newHeight });
        validateRectangle(newWidth, newHeight);
    };

    const calculatePerimeter = () => {
        return 2 * (rectangle.width + rectangle.height);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <ResizableRectangle 
                    width={rectangle.width}
                    height={rectangle.height}
                    onResize={handleResize}
                    isValidating={isValidating}
                />
                
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Rectangle Information
                    </Typography>
                    <Typography>
                        Width: {rectangle.width}px
                    </Typography>
                    <Typography>
                        Height: {rectangle.height}px
                    </Typography>
                    <Typography>
                        Perimeter: {calculatePerimeter()}px
                    </Typography>
                    
                    {isValidating && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography color="primary">
                                Validating dimensions...
                            </Typography>
                        </Box>
                    )}
                    
                    {validationError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {validationError}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}; 