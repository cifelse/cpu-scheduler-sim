import { cli } from "../utils/cli.js";
import { display, readInput } from "../utils/io.js";

// Name of the Algorithm
export const name = `First Come First Serve`;

/**
 * First Come First Serve Algorithm
 * @module models/fcfs
 * @async
 * @method
 * @param {String} filePath - Path of the input file
 * @param {Number} Y - Number of Processes
 * @param {Number} Z - Time Quantum (1 if not RR)
 * @returns {Boolean} - True if the user wants to try again
 */
export const execute = async (filePath, Y, Z) => {
    cli.info(`You have chosen ${name}! ${Y} processes. Q = ${Z}`, { clear: true });

    // Get the processes from the user
    const processes = await readInput(filePath, false);
    
    const results = await fcfs(processes);

    return await display(results);
}

/**
 * First Come First Serve Algorithm
 * @async
 * @method
 * @param {Array<Object>} processes - Array of Processes
 * @returns {Array<Object>} - Array of Results
 */
export const fcfs = async (processes) => {
    // Sort by Arrival Time
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0, totalWaitTime = 0, results = [];

    // Algorithm Proper
    for (const process of processes) {
        // Calculate start time (max of current time and arrival time)
        const startTime = Math.max(currentTime, process.arrival);

        // Calculate end time
        currentTime = startTime + process.burst;

        // Calculate waiting time
        const waitingTime = startTime - process.arrival;

        // Track the process details
        results.push({ id: process.id, details: `start time: ${startTime} end time: ${currentTime} | Waiting time: ${waitingTime}` });

        // Update total waiting time and current time
        totalWaitTime += waitingTime;
    };

    // Calculate average waiting time
    const averageWaitingTime = totalWaitTime / processes.length;

    // Sort by id
    results = results.sort((a, b) => a.id - b.id).map(r => { return `${r.id} ${r.details}` });

    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}