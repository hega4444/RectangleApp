import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Paper, Badge, Snackbar, Alert } from '@mui/material';

interface RectangleDimensions {
    width: number;
    height: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Rectangle: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [dimensions, setDimensions] = useState<RectangleDimensions>({ width: 200, height: 150 });
    const [perimeter, setPerimeter] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [isResizing, setIsResizing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Colors without transparency effects
    const colors = {
        success: '#2ecc71',     // More vivid green (taken from Flat UI colors)
        editing: '#ff7f50',     // Vivid coral orange
    };

    const calculatePerimeter = useCallback((dims: RectangleDimensions) => {
        setPerimeter(2 * (dims.width + dims.height));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/rectangle`)
            .then(response => response.json())
            .then((data: RectangleDimensions) => {
                setDimensions(data);
                calculatePerimeter(data);
            })
            .catch(() => {
                // Backend is off, use initial values
                calculatePerimeter(dimensions);
            });
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
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        requestAnimationFrame(() => {
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;

            // Constrain dimensions within container
            const newWidth = Math.min(
                Math.max(50, dimensions.width + deltaX),
                containerSize.width
            );
            const newHeight = Math.min(
                Math.max(50, dimensions.height + deltaY),
                containerSize.height
            );

            setDimensions({ width: newWidth, height: newHeight });
            calculatePerimeter({ width: newWidth, height: newHeight });
            setStartPos({ x: e.clientX, y: e.clientY });
        });
    }, [isResizing, startPos, dimensions, calculatePerimeter, containerSize]);

    const handleMouseUp = useCallback(() => {
        if (!isResizing) return;
        
        setIsResizing(false);
        
        // Update backend
        fetch(`${API_BASE_URL}/api/rectangle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dimensions)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .catch(err => setError(err.message));
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
                    width={dimensions.width} 
                    height={dimensions.height} 
                    style={{ 
                        cursor: isResizing ? colors.editing : colors.success,
                        maxWidth: containerSize.width,
                        maxHeight: containerSize.height,
                        minWidth: '50px',
                        minHeight: '50px',
                        position: 'relative'
                    }}
                >
                    <rect
                        width={dimensions.width}
                        height={dimensions.height}
                        fill="transparent"
                        stroke={isResizing ? colors.editing : colors.success}
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
                    Rectangle Information
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1.5 }}>
                    Perimeter: {Math.round(perimeter)}px
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.7, mb: 1 }}>
                    Width: {Math.round(dimensions.width)}px
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                    Height: {Math.round(dimensions.height)}px
                </Typography>
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity="error" 
                    sx={{ 
                        width: '100%',
                        bgcolor: 'rgba(40, 0, 60, 0.95)', // Dark purple background
                        color: '#fff',  // White text
                        '& .MuiAlert-icon': {
                            color: '#ff6b6b'  // Error icon color
                        },
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,99,99,0.2)',  // Subtle red border
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