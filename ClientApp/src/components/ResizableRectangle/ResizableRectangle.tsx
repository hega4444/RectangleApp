import React from 'react';
import { Box } from '@mui/material';

interface ResizableRectangleProps {
    width: number;
    height: number;
    onResize: (width: number, height: number) => void;
    isValidating: boolean;
}

export const ResizableRectangle: React.FC<ResizableRectangleProps> = ({
    width,
    height,
    onResize,
    isValidating
}) => {
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = width;
        const startHeight = height;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(0, startWidth + e.clientX - startX);
            const newHeight = Math.max(0, startHeight + e.clientY - startY);
            onResize(newWidth, newHeight);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <Box
            sx={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'primary.main',
                opacity: isValidating ? 0.7 : 1,
                cursor: 'se-resize',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '20px',
                    height: '20px',
                    cursor: 'se-resize'
                }
            }}
            onMouseDown={handleMouseDown}
        />
    );
};