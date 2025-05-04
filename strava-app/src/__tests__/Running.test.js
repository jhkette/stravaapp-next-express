import React from "react";
import { render, screen } from "@testing-library/react";
import Running from "../Running";

// Mock chart components
jest.mock("../components/RunChart", () => () => <div>Mocked LineChart</div>);
jest.mock("../components/Doughnut", () => () => (
  <div>Mocked DoughnutChart</div>
));
jest.mock("../components/RunChartRegression", () => () => (
  <div>Mocked RideChartRegression</div>
));

describe("Cycling component", () => {
  it("renders fallback if no 1200s power data", () => {
    const minimalUserRecords = { runningpbs: {}, runHrZones: {} };

    render(
      <Running
        userRecords={minimalUserRecords}
        mardataset={{}}
        halfdataset={{}}
      />
    );

    expect(
      screen.getByText(/Please add at least one 5km run/i)
    ).toBeInTheDocument();
  });

  it("renders charts and sections when data is present", () => {
    const userRecords = {
      runningpbs: {
        400: 120,
        800: 320,
        5000: 1200,
      },
    };

    render(
      <Running userRecords={userRecords} mardataset={{}} halfdataset={{}} />
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Pace chart: minutes per km"
    );
    expect(screen.getByText("Mocked LineChart")).toBeInTheDocument();
    expect(screen.getAllByText("Mocked RideChartRegression")).toHaveLength(2);
    expect(screen.getByText("Mocked DoughnutChart")).toBeInTheDocument();
  });
});
