import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Paginator } from "./Paginator";

describe("Paginator component", () => {
  it("renders current page information and action buttons", () => {
    const handlePageChange = vi.fn();
    const handlePageSizeChange = vi.fn();

    render(
      <Paginator
        currentPage={2}
        totalPages={5}
        pageSize={10}
        pageSizes={[10, 20, 50]}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />,
    );

    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("calls onPageChange with correct values when navigating", () => {
    const handlePageChange = vi.fn();
    const handlePageSizeChange = vi.fn();

    render(
      <Paginator
        currentPage={2}
        totalPages={5}
        pageSize={10}
        pageSizes={[10, 20, 50]}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />,
    );

    const prevButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
