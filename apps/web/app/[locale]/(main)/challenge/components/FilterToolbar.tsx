'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/server/lib/db/schema';
import type { FilterState } from '../lib/types';

interface Props {
  categories: Category[];
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

export function FilterToolbar({ categories, filter, onChange }: Props) {
  const [searchValue, setSearchValue] = useState(filter.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filter, search: searchValue });
    }, 150);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const selectStyle: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    padding: '6px 10px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    cursor: 'pointer',
    outline: 'none',
  };

  const inputStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: 160,
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '12px 16px',
        background: 'color-mix(in srgb, var(--background) 90%, transparent)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border)',
      }}
    >
      <select
        style={selectStyle}
        value={filter.category}
        onChange={(e) => onChange({ ...filter, category: e.target.value })}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={filter.difficulty}
        onChange={(e) => onChange({ ...filter, difficulty: e.target.value })}
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input
        type="text"
        placeholder="Search challenges..."
        style={inputStyle}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}
