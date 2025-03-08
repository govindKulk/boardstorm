"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
import BrandLogo from "../homepage/BrandLogo";
import { UserMenu } from "../user-menu";

export default function AllBoardNavbar({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce to prevent frequent updates

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, onSearch]);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <BrandLogo />

        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <div className="absolute left-3 text-muted-foreground">
            <FiSearch size={18} />
          </div>
          <Input
            placeholder="Search boards..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <UserMenu />
      </div>
    </nav>
  );
}
