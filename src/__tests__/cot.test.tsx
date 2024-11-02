import React from "react";
import { render, cleanup, waitFor, screen } from "@testing-library/react";
import { Tabs } from "./Tabs"; // Assuming the component is in Tabs.tsx
import "@testing-library/jest-dom";

global.fetch = require("jest-fetch-mock");

afterEach(() => {
  cleanup();
  fetch.resetMocks();
});

const categories: Category[] = [
  { id: "1", name: "Category 1" },
  { id: "2", name: "Category 2" },
];

const posts: Record<string, Post[]> = {
  "1": [
    {
      id: "1",
      title: "Post 1",
      date: "2024-11-02",
      commentCount: 5,
      shareCount: 10,
    },
    {
      id: "2",
      title: "Post 2",
      date: "2024-11-01",
      commentCount: 2,
      shareCount: 3,
    },
  ],
  "2": [
    {
      id: "3",
      title: "Post 3",
      date: "2024-10-31",
      commentCount: 8,
      shareCount: 15,
    },
  ],
};

test("<Tabs /> renders categories and posts correctly", async () => {
  // Mock the fetch calls
  fetch.mockResponses(
    [JSON.stringify(categories), { status: 200 }],
    [JSON.stringify(posts["1"]), { status: 200 }]
  );

  render(<Tabs />);

  // Wait for categories to load
  await waitFor(() =>
    expect(screen.getByText("Category 1")).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(screen.getByText("Category 2")).toBeInTheDocument()
  );

  // Check if the first tab's posts are rendered
  await waitFor(() => expect(screen.getByText("Post 1")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("Post 2")).toBeInTheDocument());

  // Click on the second tab
  screen.getByText("Category 2").click();

  // Check if the second tab's posts are rendered
  await waitFor(() => expect(screen.getByText("Post 3")).toBeInTheDocument());
});

test("<Tabs /> handles empty categories", async () => {
  // Mock the fetch call to return an empty array for categories
  fetch.mockResponseOnce(JSON.stringify([]));

  render(<Tabs />);

  // Assert that no categories are rendered
  expect(screen.queryByRole("tab")).not.toBeInTheDocument();
});

test("<Tabs /> handles errors fetching categories", async () => {
  // Mock the fetch call to return an error
  fetch.mockReject(new Error("Failed to fetch categories"));

  render(<Tabs />);

  // You might want to check for an error message or a loading state here
  // For example:
  // await waitFor(() => expect(screen.getByText('Error loading categories')).toBeInTheDocument());
});

test("<Tabs /> handles errors fetching posts", async () => {
  // Mock the fetch calls, with the second one returning an error
  fetch.mockResponses(
    [JSON.stringify(categories), { status: 200 }],
    [JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 }]
  );

  render(<Tabs />);

  // Wait for categories to load
  await waitFor(() =>
    expect(screen.getByText("Category 1")).toBeInTheDocument()
  );

  // You might want to check for an error message or a loading state here
  // For example:
  // await waitFor(() => expect(screen.getByText('Error loading posts')).toBeInTheDocument());
});
