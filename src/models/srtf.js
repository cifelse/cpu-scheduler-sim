import { cli } from "../utils/cli.js";
import { display, readInput } from "../utils/io.js";

// Name of the Algorithm
export const name = `Shortest Remaining Time First`;

/**
 * Shortest Remaining Time First Algorithm
 * @module models/srtf
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
    
    const results = await srtf(processes);
    
    return await display(results);
}

/**
 * Shortest Job First Algorithm
 * @async
 * @method
 * @param {Array<Object>} processes - Array of Processes
 * @returns {Array<Object>} - Array of Results
 */
export const srtf = async (processes) => {
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0, totalWaitTime = 0, results = [];
    let activeProcesses = [], processDetails = new Map(), lastProcess = null;

    processes.forEach(p => processDetails.set(p.id, {
        arrival: p.arrival,
        burst: p.burst,
        startTimes: [],
        endTimes: [],
        totalBurst: p.burst
    }));

    while (processes.length > 0 || activeProcesses.length > 0) {
        // Add new processes to active queue
        while (processes.length > 0 && processes[0].arrival <= currentTime) {
            let p = processes.shift();
            activeProcesses.push({...p});
            activeProcesses.sort((a, b) => a.burst - b.burst);
        }

        if (activeProcesses.length > 0) {
            let currentProcess = activeProcesses[0];

            if (lastProcess !== currentProcess.id) {
                if (lastProcess !== null) {
                    processDetails.get(lastProcess).endTimes.push(currentTime);
                }
                processDetails.get(currentProcess.id).startTimes.push(currentTime);
                lastProcess = currentProcess.id;
            }

            currentProcess.burst--;
            if (currentProcess.burst === 0) {
                let processDetail = processDetails.get(currentProcess.id);
                processDetail.endTimes.push(++currentTime);
                
                let waitingTime = 0;

                for (let i = 0; i < processDetail.startTimes.length; i++) {
                    if (i == 0) {
                        waitingTime += processDetail.startTimes[i] - processDetail.arrival;
                    }
                    else {
                        waitingTime += processDetail.startTimes[i] - processDetail.endTimes[i - 1];
                    }
                }

                totalWaitTime += waitingTime;

                let intervals = processDetail.startTimes.map((s, i) => `start time: ${s} end time: ${processDetail.endTimes[i]}`).join(' | ');
                results.push({
                    id: currentProcess.id,
                    details: `${intervals} | Waiting time: ${waitingTime}`
                });

                activeProcesses.shift();
                lastProcess = null;
            } else {
                currentTime++;
            }
        } else {
            currentTime++;
        }
    }

    // Calculate average waiting time
    const averageWaitingTime = totalWaitTime / results.length;

    // Sort by id and format results
    results = results.sort((a, b) => a.id - b.id).map(r => `${r.id} ${r.details}`);

    // Track the average waiting time
    results.push(`Average waiting time: ${averageWaitingTime.toFixed(1)}`);

    return results;
}
