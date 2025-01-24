import { CyclingPbs, RunningPbs } from "./types";

export interface BikeActivityElement {
  type: string;
  device_watts: string;
  data: [
    {
      type: string;
      data: number[];
      series_type: string;
      original_size: number;
      resolution: "high" | "medium" | "low";
    }
  ];
  watt_stream: {
    watts: {
      data: number[];
    };
    time: {
      data: number[];
    };
  };

  run_stream: {
    distance: {
      data: number[];
    };
    time: {
      data: number[];
    };
  };
  pbs: CyclingPbs
  runpbs: RunningPbs
  has_heartrate: boolean
}

export interface RunActivityElement {
  type: string;
  has_heartrate: string;
  data: [
    {
      type: string;
      data: number[];
      series_type: string;
      original_size: number;
      resolution: "high" | "medium" | "low";
    }
  ];
  watt_stream: {
    watts: {
      data: number[];
    };
    time: {
      data: number[];
    };
  };
}
