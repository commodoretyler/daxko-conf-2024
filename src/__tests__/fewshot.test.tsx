import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "../Tabs";

describe("Tabs Component", () => {
  it("should render the tabs component", async () => {
    render(<Tabs />);

    // Check if the tabs are rendered
    expect(await screen.findByText("Category 1")).toBeInTheDocument();
    expect(await screen.findByText("Category 2")).toBeInTheDocument();
  });

  it("should fetch and display posts for the active tab", async () => {
    render(<Tabs />);

    // Check if the posts for the first tab are rendered
    expect(
      await screen.findByText(`Avoid Nesting When You're Testing`)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(`How I Built A Modern Website In 2021`)
    ).toBeInTheDocument();
  });

  it("should switch tabs and display the correct posts", async () => {
    render(<Tabs />);

    // Click on the second tab
    fireEvent.click(screen.getByText("Category 2"));

    // Check if the posts for the second tab are rendered
    expect(await screen.findByText(`Post from Category 2`)).toBeInTheDocument();
  });

  it("should update posts when the active tab changes", async () => {
    render(<Tabs />);

    // Click on the second tab
    fireEvent.click(screen.getByText("Category 2"));

    // Check if the posts for the second tab are rendered
    expect(await screen.findByText(`Post from Category 2`)).toBeInTheDocument();

    // Click on the first tab
    fireEvent.click(screen.getByText("Category 1"));

    // Check if the posts for the first tab are rendered
    expect(
      await screen.findByText(`Avoid Nesting When You're Testing`)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(`How I Built A Modern Website In 2021`)
    ).toBeInTheDocument();
  });
});
