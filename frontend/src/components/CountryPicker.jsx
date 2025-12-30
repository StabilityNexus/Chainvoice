import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import countriesData from "@/lib/countries.json";

const CountryPicker = ({
  value = "",
  onChange,
  placeholder = "Select country",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Find selected country
  const selectedCountry = countriesData.find(
    (country) => country.name.toLowerCase() === value.toLowerCase()
  );

  // Filter countries based on search
  const filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle country selection
  const handleSelect = (country) => {
    onChange(country.name);
    setOpen(false);
    setSearchQuery("");
  };

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const getFlagUrl = (code) => {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          ref={inputRef}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedCountry ? (
              <>
                <img
                  src={getFlagUrl(selectedCountry.code)}
                  alt={selectedCountry.name}
                  className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="truncate text-left">{selectedCountry.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCountries.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No countries found
            </div>
          ) : (
            <div className="p-1">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-sm text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    selectedCountry?.code === country.code && "bg-accent"
                  )}
                >
                  <img
                    src={getFlagUrl(country.code)}
                    alt={country.name}
                    className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span className="text-left">{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountryPicker;

