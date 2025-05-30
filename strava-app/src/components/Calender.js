import { subMonths, eachDayOfInterval, format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import classNames from "classnames";
import { Bicycle, PersonSimpleRun,  Barbell, Heart, ArrowRight } from "phosphor-react";




// calender component
export default function EventsCalender({ userActivities }) {
  const currentDate = new Date(); // get current date

  const pastDate = subMonths(currentDate, 1); // get one month before current day

  const interval = eachDayOfInterval({
    // get the interval of days between these dates
    start: currentDate,
    end: pastDate,
  });
  // This is an object that stores the dates
  const allDates = interval.map((date) => {
    // create an array of objects with this array with date, event, and tss keys
    return {
      date: date.toString().split(" ").slice(0, 4).join(" "), // formatting date here
      events: [],
      tss: 0,
    };
  });

  const lastMonth = userActivities.filter((event) => {
    // filter activities that happen in that month
    return new Date(event.start_date) >= new Date(pastDate);
  });
  // loop through activities and find the object with the same date key
  // then add that activity to that object
  for (let activity of lastMonth) {
    let date = new Date(activity.start_date);
    let formattedDate = format(date, "E LLL dd yyyy");
    let dateFound = allDates.find((obj) => obj.date === formattedDate);
    if (dateFound) {
     
      if (activity["average_heartrate"]) { // for all actvities with heart rate
      
        dateFound.events.push([
          activity.sport_type,
          activity.average_heartrate,
          activity.tss,
          
        ]);
        dateFound.tss += activity.tss;
      } 
      
      else {  // eveything else
        dateFound.events.push([activity.sport_type]);
      }
    }
  }
   // creates the the html for the main calender
  const finalHtml = allDates.map((date) => {
    let classes = classNames({
      "bg-blue-300 h-12 w-12 rounded-sm": date.tss <= 25,
      "bg-yellow-200 h-12 w-12 rounded-sm": date.tss > 25 && date.tss <= 50,
      "bg-yellow-400 h-12  w-12 rounded-sm": date.tss > 50 && date.tss <= 70,
      "bg-orange-300 h-12 w-12 rounded-sm": date.tss > 70 && date.tss <= 100,
      "bg-orange-500 h-12 w-12 rounded-sm": date.tss > 100 && date.tss <= 130,
      "bg-red-400 h-12 w-12 rounded-sm": date.tss > 130 && date.tss <= 200,
      "bg-red-600 h-12  w-12 rounded-sm": date.tss > 200,
    });
     const sports = ["VirtualRide", "Ride", "Run", "WeightTraining" ]
    if (date.events.length) { // if the date has events on it - created in object earlier
      let eventText = date.events.map((eventArr) => { // looping through events using map
        if (eventArr.length === 1) { // if the only thing we have is an event name
          return (
            <div key={uuidv4()}>
              <p className="font-semibold py-2">{eventArr[0]}</p>{" "}
            </div>
          );
        }
        return (
          // this is the event text - that displays event info
          <div key={uuidv4()}>
            <p className="font-semibold"> 
            {(eventArr[0] === 'VirtualRide' || eventArr[0] === 'Ride' ) &&  < Bicycle size={32}  className="pr-2"/> } 
            {(eventArr[0] === "Run") &&   < PersonSimpleRun  size={32} className="pr-2"/>} 
            {(eventArr[0] === "WeightTraining") &&   <Barbell size={32} className="pr-2" />} 
            {(!sports.includes(eventArr[0])) && <Heart size={24}  />}
            {eventArr[0]}</p>
            <p>Average heartrate: {eventArr[1]}</p>
            {/* {eventArr[2]?.watts ? <p>Average watts: {eventArr[3].watts}</p> : ""}
            {eventArr[3]?.watts ? <p>Average watts: {eventArr[3].watts}</p> : ""} */}
            <p className="pb-2">TSS: {eventArr[2]}</p>{" "}
          </div>
        );
      });

      return (
        // the event text is then added to the day div wih the date
        <div key={uuidv4()} className=" flex flex-col rounded-sm  bg-gray-100 border-2 border-gray-200 justify-between  p-4 min-h-[150px]">
          <div className="py-2">
            <p className="font-semibold">{date.date}</p>
            <p>{eventText}</p>  
            <p className="font-semibold">Total Training stress: {date.tss}</p>
          </div>
          <div className={classes}></div>
        </div>
      );
    } else {
      return ( // if there are no events on the data - just add text with rest day
        <div key={uuidv4()} className="p-2 bg-gray-100 rounded-sm border-2 border-gray-200 p-4 min-h-[150px]">
          <p className="font-semibold py-2">{date.date}</p>
          <p className="font-semibold py-2">Rest day</p>
        </div>
      );
    }
  });

  return (
    <>
     <div className="flex flex-row mb-8  items-end justify-between">
        <h1 className="text-xl2">Training Calender</h1>
      <div className="w-auto inline-block ">
      
        <div className="flex flex-col  p-2">
       
          <div className="flex flex-row font-bold items-center py-2">
            <p className="pr-1">Training stress key: Low{" "}</p>
            <ArrowRight size="20px" />{" "}
            <p className="pl-1">High.{" "}</p>
          </div>
          </div>
          <div className="w-full flex">
            <div className="bg-blue-300 mx-1 h-12 w-12"></div>
            <div className="bg-yellow-200 mx-1 h-12 w-12"></div>
            <div className="bg-yellow-400 mx-1 h-12  w-12"></div>
            <div className="bg-orange-300  mx-1 h-12 w-12"></div>
            <div className="bg-orange-500 mx-1 h-12 w-12"></div>
            <div className="bg-red-400 mx-1 h-12 w-12"></div>
            <div className="bg-red-600 mx-1 h-12  w-12"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 text-sm w-full">{finalHtml}</div>
    </>
  );
}
