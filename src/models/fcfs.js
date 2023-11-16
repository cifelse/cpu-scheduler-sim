import { cli } from "../utils/cli.js";
import { display, getProcesses } from "../utils/io.js";

// Name of the Algorithm
export const name = `First Come First Serve`;

/**
 * First Come First Serve Algorithm
 * @module models/fcfs
 * @async
 * @method
 * @param {Number} Y - Number of Processes
 */
export const execute = async (Y) => {
    cli.info(`You have chosen ${name}!`, { clear: true });

    // Get the processes from the user
    const processes = await getProcesses(Y);
    
    // Sort by Arrival Time
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0, totalWaitTime = 0, results = [];

    for (const process of processes) {
        // Calculate start time (max of current time and arrival time)
        const startTime = Math.max(currentTime, process.arrival);

        // Calculate end time
        const endTime = startTime + process.burst;

        // Calculate waiting time
        const waitingTime = startTime - process.arrival;

        // Track the process details
        results.push(`${process.id} start time: ${startTime} end time: ${endTime} | Waiting time: ${waitingTime}`);

        // Update total waiting time and current time
        totalWaitTime += waitingTime;
        currentTime = endTime;
    };

    // Calculate and print the average waiting time
    const averageWaitingTime = totalWaitTime / processes.length;

    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return await display(results);
}