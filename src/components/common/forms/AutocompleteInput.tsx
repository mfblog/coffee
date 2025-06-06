'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/classNameUtils'
import { X } from 'lucide-react'

interface AutocompleteInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    suggestions: string[]
    label?: string
    className?: string
    required?: boolean
    unit?: string
    clearable?: boolean
    matchStartsWith?: boolean // Whether to match only from the beginning
    onBlur?: () => void
    containerClassName?: string
    inputType?: 'text' | 'number' | 'tel' | 'email' // Input type attribute
    inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' // Input mode attribute
    disabled?: boolean // Disabled attribute
    maxValue?: number // Maximum value attribute for limiting numeric input
    allowDecimal?: boolean // Whether to allow decimal point input
    maxDecimalPlaces?: number // Maximum decimal places allowed
    // Custom preset marking and deletion functionality
    isCustomPreset?: (value: string) => boolean
    onRemovePreset?: (value: string) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    value,
    onChange,
    placeholder = '',
    suggestions = [],
    label,
    className,
    required = false,
    unit,
    clearable = false,
    matchStartsWith = false,
    onBlur,
    containerClassName,
    inputType = 'text', // Default to text type
    inputMode, // Input mode
    disabled = false, // Default to not disabled
    maxValue,
    allowDecimal = false, // Default to not allow decimal point
    maxDecimalPlaces = 2, // Default to maximum 2 decimal places
    // Custom preset marking and deletion functionality
    isCustomPreset = () => false,
    onRemovePreset
}) => {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState(value)
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
    const [justSelected, setJustSelected] = useState(false) // Track whether user just selected a suggestion
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Update internal state when external value changes
    useEffect(() => {
        setInputValue(value)
    }, [value])

    // Filter suggestion list
    useEffect(() => {
        if (!inputValue.trim()) {
            setFilteredSuggestions(suggestions.slice(0, 10))
            return
        }

        const lowerCaseInput = inputValue.toLowerCase()
        const filtered = suggestions.filter(suggestion => {
            const lowerCaseSuggestion = suggestion.toLowerCase()
            return matchStartsWith
                ? lowerCaseSuggestion.startsWith(lowerCaseInput)
                : lowerCaseSuggestion.includes(lowerCaseInput)
        }).slice(0, 10)

        setFilteredSuggestions(filtered)
    }, [inputValue, suggestions, matchStartsWith])

    // Handle clicking outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        // Special handling for mobile touch events
        function handleTouchOutside(event: TouchEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleTouchOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleTouchOutside)
        }
    }, [])

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Handle numeric type input processing
        if (inputType === 'tel' || inputType === 'number') {
            if (allowDecimal) {
                // Allow decimal point case
                // 1. Remove all non-numeric and non-decimal characters
                let filteredValue = newValue.replace(/[^0-9.]/g, '');

                // 2. Ensure only one decimal point
                const dotIndex = filteredValue.indexOf('.');
                if (dotIndex !== -1) {
                    const beforeDot = filteredValue.substring(0, dotIndex + 1);
                    const afterDot = filteredValue.substring(dotIndex + 1).replace(/\./g, '');
                    
                    // 3. Limit decimal places
                    const limitedAfterDot = maxDecimalPlaces > 0
                        ? afterDot.substring(0, maxDecimalPlaces)
                        : afterDot;

                    filteredValue = beforeDot + limitedAfterDot;
                }

                // 4. If maxValue is set, limit the maximum input value
                if (maxValue !== undefined && filteredValue !== '' && filteredValue !== '.') {
                    const numValue = parseFloat(filteredValue);
                    if (numValue > maxValue) {
                        newValue = maxValue.toString();
                    } else {
                        newValue = filteredValue;
                    }
                } else {
                    // 5. If only decimal point is entered, auto-complete to "0."
                    if (filteredValue === '.') {
                        filteredValue = '0.';
                    }
                    newValue = filteredValue;
                }
            } else {
                // Original logic: case where decimal point is not allowed
                const numericValue = newValue.replace(/[^0-9]/g, '');
                
                if (maxValue !== undefined && numericValue !== '') {
                    const numValue = parseInt(numericValue);
                    if (numValue > maxValue) {
                        newValue = maxValue.toString();
                    } else {
                        newValue = numericValue;
                    }
                } else {
                    newValue = numericValue;
                }
            }
        }
        
        setInputValue(newValue);
        setJustSelected(false); // Reset selection state when user inputs

        // Immediately call onChange to ensure parent component gets new value promptly
        onChange(newValue);

        if (newValue.trim()) {
            setOpen(true);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (selectedValue: string) => {
        setInputValue(selectedValue)
        onChange(selectedValue)
        setOpen(false)
        setFilteredSuggestions([]) // Clear filtered suggestion list
        setJustSelected(true) // Mark that user just selected a suggestion

        // Prevent value loss due to immediate blur after selection
        setTimeout(() => {
            inputRef.current?.focus()
        }, 10)
    }

    // Handle blur
    const handleBlur = () => {
        // Delay closing dropdown to avoid missing click events when clicking options
        setTimeout(() => {
            // Check if current document focus is within dropdown to avoid immediate closure when clicking dropdown items
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(document.activeElement) &&
                document.activeElement !== inputRef.current
            ) {
                setOpen(false)
                onChange(inputValue) // Ensure external value is updated
                onBlur?.()
            }
        }, 150)
    }

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setInputValue('')
        onChange('')
        setOpen(false)
        inputRef.current?.focus()
    }

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue) {
            onChange(inputValue)
            setOpen(false)
        } else if (e.key === 'Escape') {
            setOpen(false)
        } else if (e.key === 'ArrowDown' && !open && filteredSuggestions.length > 0) {
            setOpen(true)
        }
    }

    // Handle focus
    const handleFocus = () => {
        // If user just selected a suggestion, don't open dropdown
        if (justSelected) {
            setJustSelected(false)
            return
        }

        // Otherwise, if there are suggestions, open dropdown
        if (filteredSuggestions.length > 0) {
            setOpen(true)
        }
    }

    // Handle label click
    const handleLabelClick = (e: React.MouseEvent) => {
        e.preventDefault()
        inputRef.current?.focus()
    }

    // Prevent dropdown touch event propagation
    const handleDropdownTouch = (e: React.TouchEvent) => {
        e.stopPropagation()
    }

    // Prevent default scroll behavior
    const handleTouchMove = (e: React.TouchEvent) => {
        if (open) {
            e.stopPropagation()
        }
    }

    // Handle dropdown item click
    const handleItemClick = (suggestion: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleSelectSuggestion(suggestion)
    }

    // Handle preset deletion
    const handleRemovePreset = (suggestion: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // If current value equals the preset value to be deleted, clear input
        if (inputValue === suggestion) {
            setInputValue('')
            onChange('')
        }

        // Call external deletion function
        onRemovePreset?.(suggestion)
    }

    return (
        <div
            ref={containerRef}
            className={cn("space-y-2", containerClassName)}
            onTouchMove={handleTouchMove}
        >
            {label && (
                <label
                    onClick={handleLabelClick}
                    className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 cursor-pointer"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <div className="relative w-full">
                    <input
                        ref={inputRef}
                        type={inputType}
                        inputMode={inputMode || (inputType === 'number' || inputType === 'tel' ? (allowDecimal ? 'decimal' : 'numeric') : 'text')}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400",
                            disabled && "opacity-60 cursor-not-allowed",
                            className
                        )}
                    />
                    {unit && !clearable && (
                        <span className="absolute right-0 bottom-2 text-neutral-500 dark:text-neutral-400">
                            {unit}
                        </span>
                    )}
                    {unit && clearable && (
                        <span className="absolute right-6 bottom-2 text-neutral-500 dark:text-neutral-400">
                            {unit}
                        </span>
                    )}
                    {clearable && inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-0 bottom-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 z-51"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {open && filteredSuggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        onTouchStart={handleDropdownTouch}
                        className="absolute left-0 right-0 mt-1 z-50 max-h-[200px] overflow-auto rounded-md border border-neutral-200 dark:border-neutral-800 shadow-lg bg-white dark:bg-neutral-900"
                    >
                        <ul className="py-1">
                            {filteredSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 flex justify-between items-center"
                                    onClick={(e) => handleItemClick(suggestion, e)}
                                    onTouchStart={(e) => e.stopPropagation()}
                                >
                                    <span>{suggestion}</span>
                                    
                                    {/* Show delete button if it's a custom preset and delete function is provided */}
                                    {isCustomPreset(suggestion) && onRemovePreset && (
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent click event from bubbling to li element
                                                handleRemovePreset(suggestion, e);
                                            }}
                                            className="ml-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AutocompleteInput 