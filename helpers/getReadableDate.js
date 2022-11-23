export function getReadableDate(date) {
    
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const readableDate = `${new Date(date).getDate()} ${months[new Date(date).getMonth()]
  } ${new Date(date).getFullYear()}`;

  return readableDate;
}