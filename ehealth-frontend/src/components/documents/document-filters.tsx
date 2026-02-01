import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_TYPES } from "@/lib/constants";
import { DocumentFilters, DocumentType } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";

interface DocumentFiltersProps {
  onFiltersChange: (filters: DocumentFilters) => void;
}

export function DocumentFiltersBar({ onFiltersChange }: DocumentFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DocumentType | "ALL">("ALL");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      search: search || undefined,
      documentType: type === "ALL" ? undefined : type,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setType("ALL");
    onFiltersChange({});
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select
        value={type}
        onValueChange={(val) => setType(val as DocumentType | "ALL")}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Document Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {DOCUMENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit">Filter</Button>
        {(search || type !== "ALL") && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
