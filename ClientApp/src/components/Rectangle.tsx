/**
 * Rectangle Component
 * 
 * A dynamic SVG rectangle that can be resized by dragging.
 * Features:
 * - Real-time dimension updates
 * - Perimeter calculation
 * - Backend validation
 * - Visual feedback during resizing and validation
 * 
 * @author hega4444
 * @date January 31, 2025
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Paper, Badge, Snackbar, Alert } from '@mui/material';

interface RectangleDimensions {
    Width: number;
    Height: number;
}

const API_BASE_URL = 'http://localhost:5000';

const Rectangle: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [dimensions, setDimensions] = useState<RectangleDimensions>({ Width: 200, Height: 150 });
    const [perimeter, setPerimeter] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [isResizing, setIsResizing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [hasValidationError, setHasValidationError] = useState(false);

    // Colors without transparency effects
    const colors = {
        success: '#2ecc71',     // More vivid green (taken from Flat UI colors)
        editing: '#ff7f50',     // Vivid coral orange
    };

    const calculatePerimeter = useCallback((dims: RectangleDimensions) => {
        const newPerimeter = 2 * (dims.Width + dims.Height);
        if (!isNaN(newPerimeter)) {
            setPerimeter(newPerimeter);
        }
    }, []);

    // Load initial dimensions
    useEffect(() => {
        const loadInitialDimensions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/rectangle`);
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }
                const data = await response.json();
                
                if (typeof data.width === 'number' && typeof data.height === 'number') {
                    // Convert from backend format to frontend format
                    const dims = { 
                        Width: data.width, 
                        Height: data.height 
                    };
                    setDimensions(dims);
                    calculatePerimeter(dims);
                } else {
                    throw new Error('Invalid data format from server');
                }
            } catch (error) {
                console.error('Failed to fetch:', error);
                setError('Unable to connect to server. Working in offline mode.');
                const initialDims = { Width: 200, Height: 150 };
                setDimensions(initialDims);
                calculatePerimeter(initialDims);
            }
        };

        loadInitialDimensions();
    }, [calculatePerimeter]);

    // Update container size on mount and window resize
    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setContainerSize({
                    width: clientWidth - 32, // Subtract padding
                    height: clientHeight - 32
                });
            }
        };

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        return () => window.removeEventListener('resize', updateContainerSize);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
        setIsResizing(true);
        setHasValidationError(false);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        requestAnimationFrame(() => {
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;

            // Constrain dimensions within container
            const newWidth = Math.min(
                Math.max(50, dimensions.Width + deltaX),
                containerSize.width
            );
            const newHeight = Math.min(
                Math.max(50, dimensions.Height + deltaY),
                containerSize.height
            );

            setDimensions({ Width: newWidth, Height: newHeight });
            calculatePerimeter({ Width: newWidth, Height: newHeight });
            setStartPos({ x: e.clientX, y: e.clientY });
        });
    }, [isResizing, startPos, dimensions, calculatePerimeter, containerSize]);

    const handleMouseUp = useCallback(() => {
        if (!isResizing) return;
        
        setIsResizing(false);
        
        fetch(`${API_BASE_URL}/api/rectangle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dimensions)
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    setHasValidationError(true);
                    throw new Error(data.error || 'Error saving changes');
                }
                setHasValidationError(false);
                return data;
            })
            .catch(err => {
                setError(err.message);
            });
    }, [isResizing, dimensions]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    // Only render when dimensions are loaded
    if (!dimensions) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 4, md: 6 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            position: 'relative',
            width: '100%',
            maxWidth: '90vw',  // Changed from fixed pixels
            justifyContent: 'center',
            height: '100%'
        }}>
            <Paper 
                ref={containerRef}
                elevation={8} 
                sx={{ 
                    p: 4, 
                    bgcolor: 'transparent',
                    borderRadius: 3,
                    width: { xs: '90vw', md: '65vw' },
                    height: { xs: '60vh', md: 'calc(65vw * 0.8)' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backdropFilter: 'blur(8px)',
                    background: `
                        linear-gradient(135deg, 
                            rgba(255,255,255,0.05) 0%, 
                            rgba(255,255,255,0.02) 100%
                        )
                    `,
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxHeight: '80vh',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 50% 50%, 
                                rgba(255,255,255,0.05) 1px, 
                                transparent 1px
                            )
                        `,
                        backgroundSize: '20px 20px',
                        opacity: 0.5,
                        pointerEvents: 'none'
                    }
                }}
            >
                <svg 
                    width={dimensions.Width} 
                    height={dimensions.Height} 
                    style={{ 
                        cursor: isResizing || hasValidationError ? colors.editing : colors.success,
                        maxWidth: containerSize.width,
                        maxHeight: containerSize.height,
                        minWidth: '50px',
                        minHeight: '50px',
                        position: 'relative'
                    }}
                >
                    <rect
                        width={dimensions.Width}
                        height={dimensions.Height}
                        fill="transparent"
                        stroke={isResizing || hasValidationError ? colors.editing : colors.success}
                        strokeWidth="6"
                        onMouseDown={handleMouseDown}
                        style={{ cursor: 'nwse-resize' }}
                        x="0"
                        y="0"
                    />
                </svg>
            </Paper>

            <Paper elevation={8} sx={{ 
                p: 3,
                bgcolor: 'transparent',
                borderRadius: 3,
                width: { 
                    xs: '90vw', 
                    md: '20vw'
                },
                height: 'fit-content',
                minWidth: '200px',
                backdropFilter: 'blur(8px)',
                background: `
                    linear-gradient(135deg, 
                        rgba(255,255,255,0.05) 0%, 
                        rgba(255,255,255,0.02) 100%
                    )
                `,
                border: '1px solid rgba(255,255,255,0.1)',
                alignSelf: 'flex-start',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 50% 50%, 
                            rgba(255,255,255,0.04) 1px, 
                            transparent 1px
                        )
                    `,
                    backgroundSize: '15px 15px',
                    opacity: 0.4,
                    pointerEvents: 'none'
                }
            }}>
                <Typography variant="h6" sx={{ 
                    color: colors.success, 
                    mb: 2,
                    fontSize: '1.4rem',    // Increased from 1.25rem
                    fontWeight: 600       // Increased from 500 to 600 for bolder text
                }}>
                    Rectangle App ;)
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1.5, fontWeight: 'bold', opacity: 0.9 }}>
                    Perimeter: {Math.round(perimeter)}px
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.5, mb: 1 }}>
                    Width: {Math.round(dimensions.Width)}px
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.5 }}>
                    Height: {Math.round(dimensions.Height)}px
                </Typography>
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={5000} // Increased to 5 seconds
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity="warning" // Changed from error to warning
                    sx={{ 
                        width: '100%',
                        bgcolor: 'rgba(40, 0, 60, 0.95)',
                        color: '#fff',
                        '& .MuiAlert-icon': {
                            color: colors.editing  // Use the editing color for warnings
                        },
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,99,99,0.2)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Rectangle;