import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "./Landing";

// Create a mock function for useAuth
const mockUseAuth = jest.fn();

// Replace the useAuth implementation with the mock
jest.mock("./context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the calendar component
jest.mock("./components/Calender", () => () => <div>Mocked Calendar</div>);

describe("Landing Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders connect to Strava page if unauthenticated and no activities", () => {
    mockUseAuth.mockReturnValue({ auth: false });

    render(
      <Landing
        userActivities={[]}
        link="https://strava.com/oauth"
        message=""
        importData={jest.fn()}
        fetched={false}
      />
    );

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Please click connect with Strava/i)).toBeInTheDocument();
  });

  it("renders import prompt if authenticated but no activities and fetched", () => {
    mockUseAuth.mockReturnValue({ auth: true });

    const importFn = jest.fn();
    render(
      <Landing
        userActivities={[]}
        link=""
        message=""
        importData={importFn}
        fetched={true}
      />
    );

    expect(screen.getByText(/please click import/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /import/i });
    fireEvent.click(button);
    expect(importFn).toHaveBeenCalled();
  });

  it("renders calendar if authenticated and has activities", () => {
    mockUseAuth.mockReturnValue({ auth: true });

    render(
      <Landing
        userActivities={[{ id: 1, name: "Activity 1" }]}
        link=""
        message=""
        importData={jest.fn()}
        fetched={true}
      />
    );

    expect(screen.getByText("Mocked Calendar")).toBeInTheDocument();
  });
});