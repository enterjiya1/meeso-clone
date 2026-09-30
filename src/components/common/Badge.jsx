import React from 'react';
import { Flame, Sparkles, Award, Tag } from 'lucide-react';

export const Badge = ({ text, variant = 'default', size = 'sm' }) => {
  if (!text) return null;

  const getBadgeStyle = () => {
    switch (text.toLowerCase()) {
      case 'trending':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <Flame className="w-3 h-3 text-rose-600 fill-rose-500" />
        };
      case 'best seller':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Award className="w-3 h-3 text-amber-600" />
        };
      case 'new':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Sparkles className="w-3 h-3 text-emerald-600" />
        };
      case 'handcrafted':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Tag className="w-3 h-3 text-purple-600" />
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: null
        };
    }
  };

  const style = getBadgeStyle();
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border tracking-wide uppercase ${style.bg} ${padding}`}
    >
      {style.icon}
      {text}
    </span>
  );
};

export default Badge;
