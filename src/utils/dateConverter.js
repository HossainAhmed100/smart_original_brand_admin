const DateConverter = ({ createdAt }) => {
    // Convert the ISO date string to a JavaScript Date object
    const date = new Date(createdAt);
  
    // Extract the day, month, year, hours, and minutes
    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits for the day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits for the month
    const monthName = date.toLocaleString('default', { month: 'long' }); // Full month name
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits for the minutes
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
  
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
  
    // Format the date as '12-05-2024 May HH:MM AM/PM'
    const formattedDate = `${day}-${month}-${year} ${monthName} ${hours}:${minutes} ${ampm}`;
  
    return formattedDate;
  };
  
   
export default DateConverter;
