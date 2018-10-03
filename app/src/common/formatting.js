import dateFns from 'date-fns';

function formatDate(dateTime){
  const d = dateFns.format(dateTime, 'MM/DD/YYYY');
  console.log(d);
  return d;
}
function formatTime(dateTime){
  const t = dateFns.format(dateTime, 'hh:mm A');
  console.log(t);
  return t;
}

export { formatDate, formatTime }