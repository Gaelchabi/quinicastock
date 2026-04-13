'use client';

import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/lib/app-context';
import { cn } from '@/lib/utils';

export function LocationSelector() {
  const { locations, currentLocation, setCurrentLocation } = useApp();

  if (locations.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          <span className="max-w-[150px] truncate">
            {currentLocation?.name || 'Sélectionner un magasin'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        {locations.map((location) => (
          <DropdownMenuItem
            key={location.id}
            onClick={() => setCurrentLocation(location)}
            className="cursor-pointer"
          >
            <div className="flex items-start justify-between w-full gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{location.name}</p>
                  {location.isMain && (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {location.city}
                </p>
              </div>
              {currentLocation?.id === location.id && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
