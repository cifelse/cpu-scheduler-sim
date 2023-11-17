import { cli } from "../utils/cli.js";
import { display, getProcesses } from "../utils/io.js";

// Name of the Algorithm
export const name = `Shortest Job First`;

/**
 * First Come First Serve Algorithm
 * @module models/sjf
 * @async
 * @method
 * @param {Number} Y - Number of Processes
 * @returns {Boolean} - True if the user wants to try again
 */
export const execute = async (Y) => {
    cli.info(`You have chosen ${name}!`, { clear: true });

    // Get the processes from the user
    const processes = await getProcesses(Y, true);
    
    const results = await sjf(processes);
    
    return await display(results);
}

/**
 * Shortest Job First Algorithm
 * @async
 * @method
 * @param {Array<Object>} processes - Array of Processes
 * @returns {Array<Object>} - Array of Results
 */
export const sjf = async (processes) => {
    const length = processes.length;

    // Sort by Arrival Time
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0, totalWaitTime = 0, results = [];

    while (processes.length > 0) {
        let availableProcesses = processes.filter(p => p.arrival <= currentTime);
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        availableProcesses.sort((a, b) => a.burst - b.burst);
        let currentProcess = availableProcesses[0];

        let startTime = Math.max(currentTime, currentProcess.arrival);
        let endTime = startTime + currentProcess.burst;
        let waitTime = startTime - currentProcess.arrival;

        totalWaitTime += waitTime;
        currentTime = endTime;

        results.push({ 
            id: currentProcess.id, 
            details: `start time: ${startTime} end time: ${endTime} | Waiting time: ${waitTime}` 
        });
        
        processes = processes.filter(p => p.id !== currentProcess.id || p.arrival !== currentProcess.arrival);
    }

    // Calculate average waiting time
    const averageWaitingTime = totalWaitTime / length;

    // Sort by id
    results = results.sort((a, b) => a.id - b.id).map(r => { return `${r.id} ${r.details}` });

    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}