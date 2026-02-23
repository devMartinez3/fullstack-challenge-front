"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizes?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [5, 10, 15, 20];

export function Paginator({
  currentPage,
  totalPages,
  pageSize,
  pageSizes = PAGE_SIZES,
  onPageChange,
  onPageSizeChange,
}: PaginatorProps) {
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Items per page</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-[70px]">
              {pageSize}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            {pageSizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">
            Page {currentPage} of {Math.max(1, totalPages)}
          </p>
          <Input
            type="number"
            min={1}
            max={Math.max(1, totalPages)}
            value={currentPage}
            onChange={handlePageInput}
            className="w-16 h-8 text-center"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
