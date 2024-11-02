import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "./Tabs";
import fetchMock from "jest-fetch-mock";

// Mock fetch
fetchMock.enableMocks();

describe("Tabs Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should render the tabs component", () => {
    render(<Tabs />);
    // Check if the component renders without crashing
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("should fetch and display categories on mount", async () => {
    const mockCategories: Category[] = [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

    render(<Tabs />);

    // Wait for the categories to be fetched and rendered
    expect(await screen.findByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
  });

  it("should fetch posts when a tab is clicked", async () => {
    const mockCategories: Category[] = [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

    const mockPosts: Post[] = [
      {
        id: "1",
        title: "Post 1",
        date: "2024-11-02",
        commentCount: 10,
        shareCount: 5,
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockPosts));

    render(<Tabs />);

    // Click on the second tab
    fireEvent.click(screen.getByText("Category 2"));

    // Wait for the posts to be fetched and rendered
    expect(await screen.findByText("Post 1")).toBeInTheDocument();
  });

  it("should update posts when a tab is clicked again", async () => {
    const mockCategories: Category[] = [{ id: "1", name: "Category 1" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

    const mockPosts1: Post[] = [
      {
        id: "1",
        title: "Post 1",
        date: "2024-11-02",
        commentCount: 10,
        shareCount: 5,
      },
    ];
    const mockPosts2: Post[] = [
      {
        id: "2",
        title: "Post 2",
        date: "2024-11-02",
        commentCount: 20,
        shareCount: 10,
      },
    ];
    fetchMock.mockResponses(
      JSON.stringify(mockPosts1),
      JSON.stringify(mockPosts2)
    );

    render(<Tabs />);

    // Click on the first tab
    fireEvent.click(screen.getByText("Category 1"));

    // Wait for the first set of posts to be fetched and rendered
    expect(await screen.findByText("Post 1")).toBeInTheDocument();

    // Click on the first tab again
    fireEvent.click(screen.getByText("Category 1"));

    // Wait for the second set of posts to be fetched and rendered
    expect(await screen.findByText("Post 2")).toBeInTheDocument();
  });

  it("should not fetch posts if no categories are available", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<Tabs />);

    // Check if no posts are fetched or rendered
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
