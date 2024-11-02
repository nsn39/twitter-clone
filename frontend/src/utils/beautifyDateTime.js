const monthIntToStr = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
}


const beautifyTimestamp = (originalTimestamp) => {

    const timestampObj = new Date(originalTimestamp);
    const timestampValue = timestampObj.valueOf();
    const dateObj = new Date(timestampValue);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    console.log(year, month, date, hours, minutes, seconds);

    const currentTimestampValue = Date.now();

    const timestampDifferenceSeconds = (currentTimestampValue - timestampValue)/1000.0;
    var beautifiedTimeAgo = "";

    if (timestampDifferenceSeconds < 59) {
        //seconds
        beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds)).toString() + " sec"
    }
    else if (timestampDifferenceSeconds < 3599) {
        //minutes
        beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds / 60.0)).toString() + " min"
    }
    else if (timestampDifferenceSeconds < 86399) {
        //hours
        beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds / 3600.0)).toString() + "h"
    }
    else if (timestampDifferenceSeconds < 1036799) {
        //within same year; show only month and day
        beautifiedTimeAgo = monthIntToStr[month] + " " + date;
    }
    else {
        //show full date
        beautifiedTimeAgo = monthIntToStr[month] + " " + date + " ," + year;
    }
    const beautifiedTimeAgoHover = hours + ":" + minutes + " - " + date + " " + monthIntToStr[month] + ", " + year;
    const beautifiedTimeAgoPost = hours + ":" + minutes + " • " + monthIntToStr[month] + " " + date + ", " + year;
    
    return {
        "beautifiedTimeAgo": beautifiedTimeAgo,
        "beautifiedTimeAgoHover": beautifiedTimeAgoHover,
        "beautifiedTimeAgoPost": beautifiedTimeAgoPost
    };
}

export default beautifyTimestamp;
