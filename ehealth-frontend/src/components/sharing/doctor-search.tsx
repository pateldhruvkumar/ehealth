"use client";

import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchDoctors } from "@/hooks/use-doctor";
import { getInitials } from "@/lib/utils";
import { Doctor } from "@/types";
import { Check, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // Need to create this hook or inline

// Inline debounce for simplicity since I missed creating it in shared hooks
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
}

interface DoctorSearchProps {
  onSelect: (doctor: Doctor) => void;
  selectedDoctorId?: string;
}

export function DoctorSearch({ onSelect, selectedDoctorId }: DoctorSearchProps) {
  const [query, setQuery] = useState("");
  // Simple manual debounce effect logic or hook
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Effect to debounce
  useState(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  });

  const { data, isLoading } = useSearchDoctors({
    query: debouncedQuery,
    limit: 5,
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search by name, specialization, or hospital..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto rounded-md border bg-slate-50 dark:bg-slate-900">
        {isLoading && query ? (
          <div className="p-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : data?.items.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            No doctors found.
          </div>
        ) : !query && !data ? (
          <div className="p-4 text-center text-sm text-slate-500">
            Start typing to find a doctor.
          </div>
        ) : (
          <div className="divide-y">
            {data?.items.map((doctor) => (
              <div
                key={doctor.userId}
                className="flex items-center justify-between p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={doctor.profileImage} />
                    <AvatarFallback>
                      {getInitials(`${doctor.firstName} ${doctor.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {doctor.specialization} • {doctor.hospitalName}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={selectedDoctorId === doctor.userId ? "default" : "outline"}
                  onClick={() => onSelect(doctor)}
                >
                  {selectedDoctorId === doctor.userId ? (
                    <Check className="mr-2 h-3 w-3" />
                  ) : null}
                  {selectedDoctorId === doctor.userId ? "Selected" : "Select"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
