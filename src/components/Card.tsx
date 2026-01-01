import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
    variant?: 'default' | 'glass' | 'flat';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    className,
    children,
    variant = 'default',
    padding = 'md',
    ...props
}) => {
    const baseStyles = 'rounded-[20px] overflow-hidden transition-all duration-300';

    const variants = {
        default: 'bg-white shadow-sm border border-[rgba(0,0,0,0.02)]',
        glass: 'glass shadow-float',
        flat: 'bg-[var(--color-bg-secondary)]'
    };

    const paddings = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8'
    };

    return (
        <motion.div
            className={clsx(baseStyles, variants[variant], paddings[padding], className)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
