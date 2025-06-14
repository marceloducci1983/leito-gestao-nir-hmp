
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useMGCities } from '@/hooks/queries/useAmbulanceQueries';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Digite o nome da cidade..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { data: cities = [] } = useMGCities();

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectCity = (city: string) => {
    setInputValue(city);
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className="w-full"
      />
      
      {isOpen && filteredCities.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <div className="p-1">
            {filteredCities.map((city, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleSelectCity(city)}
              >
                {city}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CityAutocomplete;
