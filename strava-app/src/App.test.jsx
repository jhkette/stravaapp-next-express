import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";



// Mocking child components to simplify test
jest.mock("./components/Sidebar", () => () => <div>Sidebar</div>);
jest.mock("./components/Footer", () => () => <div>Footer</div>);
jest.mock("./components/Header", () => () => <div>Header</div>);
jest.mock("./Landing", () => () => <div>Landing Page</div>);

describe("App Component", () => {
  test("renders without crashing and shows Landing page", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    // Expect Landing page to be rendered
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});