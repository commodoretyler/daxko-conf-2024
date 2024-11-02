import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tabs } from "../Tabs";
import fetchMock from "jest-fetch-mock";

describe("<Tabs />", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch categories on mount", async () => {
    const mockCategories: Category[] = [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

    render(<Tabs />);

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
  });

  it("should fetch posts for the active tab", async () => {
    const mockCategories: Category[] = [{ id: "1", name: "Category 1" }];
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "Post 1",
        date: "2024-11-02",
        commentCount: 10,
        shareCount: 5,
      },
    ];
    fetchMock.mockResponses(
      JSON.stringify(mockCategories),
      JSON.stringify(mockPosts)
    );

    render(<Tabs />);

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });
  });

  it("should update the active tab when a tab is clicked", async () => {
    const mockCategories: Category[] = [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

    render(<Tabs />);

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Category 2"));

    // Add assertions to check if the active tab has changed and corresponding posts are fetched
  });

  it("should handle API errors gracefully", async () => {
    fetchMock.mockReject(new Error("API error"));

    render(<Tabs />);

    // Add assertions to check for error handling (e.g., display an error message)
  });

  it("should not fetch posts if categories are not loaded", async () => {
    render(<Tabs />);

    // Assert that fetch is not called for posts
  });
});
