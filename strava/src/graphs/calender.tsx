import { subMonths, eachDayOfInterval, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDumbbell,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";


import { faBiking, faRunning } from "@fortawesome/free-solid-svg-icons";

type Event = [
  sport_type: string,
  heartrateOrTss: number | null,
  tss?: number | null,
  watts?: number | null
];

// Define the types for allDates array
interface DateObject {
  date: string;
  events: Event[]; // Array of Event type
  tss: number;
}
// Modal.setAppElement('#yourAppElement');

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    transition: ".3s",
    borderRadius: ".5rem",
    backgroundColor: "#ededed",
  },
};

// Calendar component
export default function EventsCalender({
  userActivities,
}: {
  userActivities: any[];
}) {
  const currentDate = new Date(); // get current date
  const pastDate = subMonths(currentDate, 1); // get one month before current day

  const interval = eachDayOfInterval({
    // get the interval of days between these dates
    start: currentDate,
    end: pastDate,
  });

  // Create an array of objects with date, event, and tss keys
  const allDates: DateObject[] = interval.map((date) => {
    return {
      date: date.toString().split(" ").slice(0, 4).join(" "), // formatting date here
      events: [], // This will now accept the correct event type
      tss: 0,
    };
  });

  const lastMonth = userActivities.filter((event) => {
    // Filter activities that happen in that month
    return new Date(event.start_date) >= new Date(pastDate);
  });

  // Loop through activities and find the object with the same date key
  for (let activity of lastMonth) {
    let date = new Date(activity.start_date);
    let formattedDate = format(date, "E LLL dd yyyy");
    let dateFound = allDates.find((obj) => obj.date === formattedDate);

    if (dateFound) {
      const watts: number | null = activity["average_watts"]
        ? activity["average_watts"]
        : null;

      if (activity["average_heartrate"]) {
        // For all activities with heart rate
        dateFound.events.push([
          activity.sport_type,
          activity.average_heartrate,
          activity.tss,
          watts,
        ]);
        dateFound.tss += activity.tss;
      } else if (watts) {
        // If power meter but no heart rate
        dateFound.events.push([activity.sport_type, activity.tss, watts]);
      } else {
        // Everything else
        dateFound.events.push([activity.sport_type, null]);
      }
    }
  }

  // Create the HTML for the main calendar
  const finalHtml = allDates.map((date) => {
    let classes = classNames({
      "bg-blue-300 rounded-3xl my-2 h-12 w-12": date.tss <= 25,
      "bg-yellow-200 rounded-3xl my-2 h-12 w-12": date.tss > 25 && date.tss <= 50,
      "bg-yellow-400 rounded-3xl my-2 h-12  w-12": date.tss > 50 && date.tss <= 70,
      "bg-orange-300 rounded-3xl my-2 h-12 w-12": date.tss > 70 && date.tss <= 100,
      "bg-orange-500 rounded-3xl my-2 h-12 w-12": date.tss > 100 && date.tss <= 130,
      "bg-red-400 rounded-3xl my-2 h-12 w-12": date.tss > 130 && date.tss <= 200,
      "bg-red-600 rounded-3xl my-2 h-12  w-12": date.tss > 200,
    });

    const sports = ["VirtualRide", "Ride", "Run", "WeightTraining"];

    if (date.events.length) {
      let eventText = date.events.map((eventArr) => {
        return (
          <div key={uuidv4()} id={uuidv4()}>
            <p className="font-semibold">
              {(eventArr[0] === "VirtualRide" || eventArr[0] === "Ride") && (
                <FontAwesomeIcon icon={faBiking} size="sm" className="pr-2" />
              )}
              {eventArr[0] === "Run" && (
                <FontAwesomeIcon icon={faRunning} size="sm" className="pr-2" />
              )}
              {eventArr[0] === "WeightTraining" && (
                <FontAwesomeIcon icon={faDumbbell} size="sm" className="pr-2" />
              )}
              {!sports.includes(eventArr[0]) && (
                <FontAwesomeIcon icon={faHeart} size="sm" className="pr-2" />
              )}
              {eventArr[0]}
            </p>
            <p className="text-sm">Average heartrate: {eventArr[1]}</p>
            {eventArr[3] ? <p>Average watts: {eventArr[3]}</p> : ""}
            <p className="pb-2 text-sm">TSS: {eventArr[2]}</p>
          </div>
        );
      });

      return (
        <div
          key={uuidv4()}
          className="flex flex-col bg-white rounded-lg justify-between  px-4 min-h-[150px] cursor-pointer"
        >
          <div className="py-2">
            <p className="font-extrabold text-lg pt-2 pb-6">{date.date}</p>
            <p>{eventText}</p>
            <p className="text-sm">Total TSS: {date.tss}</p>
          </div>
          <div className={classes}></div>
        </div>
      );
    } else {
      return (
        <div
          key={uuidv4()}
          className="p-4 bg-white rounded-lg p-2 min-h-[150px] "
        >
          <p className="font-extrabold pt-2 pb-6 text-lg">{date.date}</p>
          <p className="py-2 text-sm">Rest day</p>
        </div>
      );
    }
  });

  return (
    <>
      <div className="flex flex-row mb-8 items-end justify-between">
        <h1 className="text-xl">Training Calendar</h1>
        <div className="w-auto inline-block">
          <div className="flex flex-col p-2">
            <p className="flex font-bold items-center py-2">
              Training stress key: Low
              <FontAwesomeIcon
                icon={faArrowRight}
                size="sm"
                className="mx-2"
              />{" "}
              High.
            </p>
          </div>
          <div className="w-full flex">
            <div className="bg-blue-300 rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-yellow-200 rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-yellow-400 rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-orange-300  rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-orange-500 rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-red-400 rounded-lg mx-1 h-12 w-12"></div>
            <div className="bg-red-600  rounded-lg mx-1 h-12 w-12"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 text-sm w-full">{finalHtml}</div>
    </>
  );
}
