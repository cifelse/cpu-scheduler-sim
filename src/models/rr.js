import { cli } from "../utils/cli.js";
import { display, getProcesses } from "../utils/io.js";

// Name of the Algorithm
export const name = `Round Robin`;

/**
 * First Come First Serve Algorithm
 * @module models/rr
 * @async
 * @method
 * @param {Number} Y - Number of Processes
 * @param {Number} Z - Time Slice Value
 * @returns {Boolean} - True if the user wants to try again
 */
export const execute = async (Y, Z) => {
    cli.info(`You have chosen ${name}! [With Quantum = ${Z}]`, { clear: true });

    // Get the processes from the user
    const processes = await getProcesses(Y);
    
    const results = await rr(processes, Z);

    return await display(results);
}

/**
 * Round Robin Algorithm
 * @async
 * @method
 * @param {Array<Object>} processes - Array of Processes
 * @param {Number} quantum - Time Slice Value
 * @returns {Array<Object>} - Array of Results
 */
export const rr = async (processes, quantum) => {
    // Use a queue to track the processes
    let queue = processes.sort((a, b) => a.arrival - b.arrival).map(p => ({ ...p, remaining: p.burst, history: [] }));

    let currentTime = 0, totalWaitTime = 0, results = [];

    // Algorithm Proper
    while (queue.length > 0) {
        let process = queue.shift();

        // Check if the process has arrived
        if (process.arrival > currentTime) {
            currentTime = process.arrival;
        }

        // Calculate the time slice for the current process
        const diff = Math.min(process.remaining, quantum);

        // Track the process history
        process.history.push({ start: currentTime, end: currentTime + diff });

        // Update current time and remaining burst time
        currentTime += diff;
        process.remaining -= diff;

        // Check if the process is not finished and requeue it
        if (process.remaining > 0) {
            queue.push(process);
            continue;
        }

        // Calculate total waiting time
        let waitingTime = process.history.reduce((accumulator, history, index) => {
            if (index === 0) return accumulator + history.start - process.arrival;
            return accumulator + history.start - process.history[index - 1].end;
        }, 0);

        // Update total waiting time
        totalWaitTime += waitingTime;

        // Print the process details
        let timesString = process.history.map(t => `start time: ${t.start} end time: ${t.end}`).join(" | ");
        
        // Track final process details
        results.push({ id: process.id, details: `${timesString} | Waiting time: ${waitingTime}` });
    }

    // Calculate average waiting time
    const averageWaitingTime = totalWaitTime / processes.length;
    
    // Sort by id
    results = results.sort((a, b) => a.id - b.id).map(r => { return `${r.id} ${r.details}` });
    
    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}