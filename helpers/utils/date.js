const addDays = (days) => {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const formattedDate = (date) => {
  
}

module.exports = { addDays }