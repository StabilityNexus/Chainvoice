import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 250;
const normalizeSearchText = (text) => String(text || '').trim().toLocaleLowerCase();

export default function ProductAutocompleteInput({
  value,
  onChange,
  onSelectProduct,
  catalogMetadata,
  placeholder,
  className,
  name,
  inputRef,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [totalMatches, setTotalMatches] = useState(0);
  const wrapperRef = useRef(null);
  const internalInputRef = useRef(null);
  const listRef = useRef(null);
  const listId = useRef(`autocomplete-list-${Math.random().toString(36).slice(2, 9)}`);

  const setRefs = useCallback(
    (el) => {
      internalInputRef.current = el;
      if (typeof inputRef === 'function') {
        inputRef(el);
      } else if (inputRef) {
        inputRef.current = el;
      }
    },
    [inputRef],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const catalogData = catalogMetadata?.data;
  const hasCatalog = Array.isArray(catalogData) && catalogData.length > 0;

  useEffect(() => {
    if (!hasCatalog) {
      setSuggestions([]);
      setActiveIndex(-1);
      setTotalMatches(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      const searchTerm = normalizeSearchText(value);
      const baseList = searchTerm
        ? catalogData.filter((product) => {
            const productName = normalizeSearchText(product.name || product.description);
            return productName.includes(searchTerm);
          })
        : catalogData;

      setTotalMatches(baseList.length);
      setSuggestions(baseList.slice(0, visibleCount));
      setActiveIndex(-1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [value, visibleCount, catalogData, hasCatalog]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [value]);

  const scrollActiveIntoView = useCallback((index) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[role="option"]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    scrollActiveIntoView(activeIndex);
  }, [activeIndex, scrollActiveIntoView]);

  const handleInputChange = useCallback(
    (e) => {
      onChange(e);
      setShowSuggestions(true);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (product) => {
      setShowSuggestions(false);
      setActiveIndex(-1);
      onSelectProduct(product);
    },
    [onSelectProduct],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
        return;
      }

      if (e.key === 'Enter' && showSuggestions) {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        }
        return;
      }

      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < suggestions.length - 1 ? prev + 1 : prev;
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : 0;
          return next;
        });
      }
    },
    [showSuggestions, suggestions, activeIndex, handleSelect, scrollActiveIntoView],
  );

  const productKey = useCallback(
    (product, idx) => `${normalizeSearchText(product.name || product.description)}-${product.price}-${idx}`,
    [],
  );

  const showNoResults = showSuggestions && suggestions.length === 0 && hasCatalog && value?.trim();

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        type="text"
        placeholder={placeholder}
        className={className}
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        ref={setRefs}
        autoComplete="off"
        role="combobox"
        aria-expanded={showSuggestions && suggestions.length > 0}
        aria-controls={listId.current}
        aria-activedescendant={activeIndex >= 0 ? `${listId.current}-option-${activeIndex}` : undefined}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={listId.current}
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm"
        >
          {suggestions.map((product, idx) => (
            <li
              key={productKey(product, idx)}
              id={`${listId.current}-option-${idx}`}
              role="option"
              aria-selected={activeIndex === idx}
              className={`px-4 py-2 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center ${activeIndex === idx ? 'bg-green-50 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => handleSelect(product)}
            >
              <div className="font-medium text-gray-800 truncate pr-2" title={product.name || product.description}>
                {product.name || product.description}
              </div>
              <div className="text-gray-500 font-mono shrink-0">{product.price}</div>
            </li>
          ))}
          {totalMatches > suggestions.length && (
            <li className="px-2 py-2 bg-gray-50 border-t border-gray-100" role="presentation">
              <button
                type="button"
                className="w-full text-xs font-medium text-gray-700 hover:text-gray-900 py-1"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load more products ({totalMatches - suggestions.length} remaining)
              </button>
            </li>
          )}
        </ul>
      )}
      {showNoResults && (
        <div
          role="status"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg text-sm px-3 py-2 text-gray-500"
        >
          No matching products found
        </div>
      )}
    </div>
  );
}
