const mysql = require('mysql2/promise');

// Function to split time and assign token count to each interval
function splitTimeWithTokenCount(startTime, endTime, tokenCount) {
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
            endTime: intervalEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tokenCount: Math.ceil(tokenCount / (end.getTime() - start.getTime()) * intervalSeconds)
        });
    }

    return intervals;
}

// Function to insert data into MySQL database
async function insertIntervals(intervals, doctorId, dayOfWeek) {
    try {
        const connection = await mysql.createConnection({
            host: 'your_mysql_host',
            user: 'your_mysql_username',
            password: 'your_mysql_password',
            database: 'your_database_name'
        });

        for (const interval of intervals) {
            const [rows, fields] = await connection.execute(
                'INSERT INTO time_intervals (doctor_id, day_of_week, start_time, end_time, token_count) VALUES (?, ?, ?, ?, ?)',
                [doctorId, dayOfWeek, interval.startTime, interval.endTime, interval.tokenCount]
            );
            console.log(`Inserted interval: ${interval.startTime} - ${interval.endTime} with token count: ${interval.tokenCount}`);
        }

        await connection.end();
        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

// Example usage
const startTime = '10:00 AM';
const endTime = '11:00 AM';
const tokenCount = 20;
const doctorId = 1;
const dayOfWeek = 'Monday';

const timeIntervals = splitTimeWithTokenCount(startTime, endTime, tokenCount);
insertIntervals(timeIntervals, doctorId, dayOfWeek);
