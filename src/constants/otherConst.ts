
import { BadgeVariant } from '@/types/badges';

export const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-[#F3F4F6] text-[#374151]',
    success: 'bg-[#ECFDF5] text-[#059669]',
    warning: 'bg-[#FEF3C7] text-[#D97706]',
    error: 'bg-[#FEE2E2] text-[#DC2626]',
  }

export const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
