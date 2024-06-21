function splitTime(startTime, endTime, tokenCount) {
    const start = new Date(`01/01/1970 ${startTime}`);
    const end = new Date(`01/01/1970 ${endTime}`);

    const timeDiff = (end.getTime() - start.getTime()) / 1000; // Time difference in seconds
    const intervalSeconds = timeDiff / tokenCount; // Interval in seconds

    const intervals = [];
    for (let i = 0; i < tokenCount; i++) {
        const intervalStart = new Date(start.getTime() + (intervalSeconds * i) * 1000);
        const intervalEnd = new Date(start.getTime() + (intervalSeconds * (i + 1)) * 1000);
        intervals.push({
            startTime: intervalStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: intervalEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    return intervals;
}

// Example usage
const startTime = '10:00 AM';
const endTime = '11:00 AM';
const tokenCount = 10;

const timeIntervals = splitTime(startTime, endTime, tokenCount);
console.log(timeIntervals);
