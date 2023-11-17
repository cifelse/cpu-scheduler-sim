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
    const processes = await getProcesses(Y);
    
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
    // Sort by Arrival Time
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0, totalWaitTime = 0, results = [];

    // Algorithm Proper
    


    // Sort by id
    results = results.sort((a, b) => a.id - b.id).map(r => { return `${r.id} ${r.details}` });

    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}