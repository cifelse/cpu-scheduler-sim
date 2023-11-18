import { cli } from "../utils/cli.js";
import { display, readInput } from "../utils/io.js";

// Name of the Algorithm
export const name = `Round Robin`;

/**
 * First Come First Serve Algorithm
 * @module models/rr
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
    const { contents: processes } = await readInput(filePath, false);

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
    let results = [], queue = [], history = new Map(), totalWaitTime = 0;

    const length = processes.length;

    // Sort the processes by arrival time
    processes = processes.sort((a, b) => a.arrival - b.arrival).map((p) => ({ ...p, remaining: p.burst, startTimes: [], endTimes: [] }));

    processes.forEach(p => history.set(p.id, []));

    let currentTime = processes[0].arrival;

    queue.push(processes.shift());

    while (queue.length > 0) {
        const process = queue.shift();

        const startTime = currentTime;

        const temp = process.remaining;

        const diff = Math.max(0, process.remaining - quantum);

        process.remaining = diff;

        let final = 0;

        if (process.remaining > 0) {
            currentTime += quantum;
            final += quantum;
        }
        else {
            currentTime += temp;
            final += temp;
        }

        const currentLength = processes.length;
        const tempProcesses = [];

        for (let i = 0; i < currentLength; i++) {
            const p = processes[i];

            if (p.arrival <= currentTime) {
                queue.push(p);
            }
            else {
                tempProcesses.push(p);
            
            }
        }

        processes = tempProcesses;

        if (process.remaining > 0) {
            process.startTimes.push(startTime);
            process.endTimes.push(currentTime);
            queue.push(process);
            history.get(process.id).push(`start time: ${startTime} end time: ${currentTime}`);
        }
        else {
            process.startTimes.push(startTime);
            process.endTimes.push(currentTime);
            
            let waitingTime = 0;

                for (let i = 0; i < process.startTimes.length; i++) {
                    if (i == 0) {
                        waitingTime += process.startTimes[i] - process.arrival;
                    }
                    else {
                        waitingTime += process.startTimes[i] - process.endTimes[i - 1];
                    }
                }

            totalWaitTime += waitingTime;

            history.get(process.id).push(`start time: ${startTime} end time: ${currentTime} | Waiting time: ${waitingTime}`);
        }
    }

    results = Array.from(history.entries()).map(([id, history]) => `${id} ${history.join(' ')}`);

    const averageWaitingTime = totalWaitTime / length;

    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}