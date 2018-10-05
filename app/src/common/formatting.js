// LIBRARIES
import dateFns from 'date-fns';

// Format the timestamp passed in to show a reader-friendly DATE
function formatDate(dateTime){
  const d = dateFns.format(dateTime, 'MM/DD/YYYY');
  return d;
}

// Format the timestamp passed in to show a reader-friendly TIME
function formatTime(dateTime){
  const t = dateFns.format(dateTime, 'hh:mm A');
  return t;
}

export { formatDate, formatTime }