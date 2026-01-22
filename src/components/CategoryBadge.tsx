import { EventCategory, getCategoryColor } from '@/data/events';

interface CategoryBadgeProps {
  category: EventCategory;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge = ({ category, size = 'md' }: CategoryBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  return (
    <span className={`inline-block font-semibold text-primary-foreground rounded-full ${getCategoryColor(category)} ${sizeClasses[size]}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
