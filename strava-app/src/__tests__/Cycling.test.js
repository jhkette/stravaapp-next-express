import React from "react";
import { render, screen } from "@testing-library/react";
import Cycling from "../Cycling";

// Mock chart components
jest.mock("../components/LineChart", () => () => <div>Mocked LineChart</div>);
jest.mock("../components/Doughnut", () => () => <div>Mocked DoughnutChart</div>);
jest.mock("../components/RideChartRegression", () => () => (
  <div>Mocked RideChartRegression</div>
));
jest.mock("../components/Ftp", () => () => <div>Mocked FtpChart</div>);

describe("Cycling component", () => {
  it("renders fallback if no 1200s power data", () => {
    const minimalUserRecords = { cyclingpbs: {}, bikeHrZones: {} };

    render(
      <Cycling
        userRecords={minimalUserRecords}
        hardknott={{}}
        scotland={{}}
        ftp={250}
        weight={70}
      />
    );

    expect(
      screen.getByText(/please add at least one 30 mins effort/i)
    ).toBeInTheDocument();
  });

  it("renders charts and sections when data is present", () => {
    const mockRecords = {
      cyclingpbs: {
        1200: 300, // 20-minute power
      },
      bikeHrZones: {
        zone1: 10,
        zone2: 20,
        zone3: 30,
        zone4: 25,
        zone5: 15,
      },
    };

    render(
      <Cycling
        userRecords={mockRecords}
        hardknott={{}} 
        scotland={{}}
        ftp={280}
        weight={78}
      />
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("Power Chart");
    expect(screen.getByText("Mocked LineChart")).toBeInTheDocument();
    expect(screen.getAllByText("Mocked RideChartRegression")).toHaveLength(2);
    expect(screen.getByText("Mocked DoughnutChart")).toBeInTheDocument();
    expect(screen.getByText("Mocked FtpChart")).toBeInTheDocument();
  });
});
