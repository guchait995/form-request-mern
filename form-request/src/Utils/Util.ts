import {
  REQUEST_APPROVED,
  REQUEST_PENDING,
  REQUEST_RAISE_FOR_APPROVAL
} from "../AppConstants";
import { format } from "util";
import Request from "../Models/Request";

export const getLastSeen = time => {
  return calcDate(time);
};
function calcDate(time) {
  var today = new Date();
  var diff = Math.floor(today.getTime() - time);
  var sec = Math.floor(diff / 1000);
  var min = Math.floor(sec / 60);
  var hour = Math.floor(min / 60);
  var days = Math.floor(hour / 24);
  var months = Math.floor(days / 31);
  var years = Math.floor(months / 12);
  if (years > 0) {
    return years + " YRS";
  }
  if (months > 0) {
    return months + " MNS";
  }
  if (days > 0) {
    return days + " DYS";
  }
  if (hour > 0) {
    return hour + " HRS";
  }
  if (min > 1) {
    return min + " MIN";
  }
  if (min <= 1) {
    return "1 MIN";
  }
  return null;
}

export const isValidEmail = (email: string | null) => {
  if (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
  }
  return false;
};

export const formatTimeStamp = time => {
  var date: Date = new Date(time);

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? 0 + minutes : minutes;

  var strTime = pad(hours, 2) + ":" + pad(minutes, 2) + " " + ampm;
  return strTime;
};
function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
export const handleKeyDown = event => {
  if (event.key === "Enter") {
    return true;
  } else return false;
};

function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test = Math.round(n) / multiplicator;
  return +test.toFixed(digits);
}
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
export const getDate = millis => {
  var dateObj: Date = new Date(millis);
  var date = dateObj.getDate();
  var dayOfWeek = dateObj.getDay();
  var month = dateObj.getMonth();
  return format("%s, %d %s", days[dayOfWeek], date, months[month]);
};

export const getStatusFromCode = (statusCode: number): string => {
  if (statusCode === REQUEST_APPROVED) {
    return "Approved";
  } else if (statusCode === REQUEST_PENDING) {
    return "Pending";
  } else {
    return "Waiting";
  }
};

export const getIndex = (arr: Request[], elem: Request): number => {
  arr.map((element, index) => {
    console.log(element.time);
    console.log(elem.time);
    if (element.time && element.time === elem.time) {
      console.log("match");
      return index;
    }
  });
  return -1;
};
export const removeELement = (arr: Request[], elem: Request): Request[] => {
  arr.map((element, index) => {
    if (element.time && element.time === elem.time) {
      arr.splice(index, 1);
      return index;
    }
  });
  return arr;
};
