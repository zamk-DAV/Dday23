import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}, ref) => {

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-pop)] shadow-sm',
        secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        ghost: 'bg-transparent hover:bg-[rgba(0,0,0,0.05)] text-[var(--color-text-primary)]',
        glass: 'glass text-[var(--color-text-primary)] hover:bg-white/80'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-2'
    };

    return (
        <motion.button
            ref={ref}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            whileTap={{ scale: 0.95 }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children as React.ReactNode}
        </motion.button>
    );
});

Button.displayName = 'Button';
