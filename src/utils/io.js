import { cli } from "./cli.js";
import readline from "readline";
import fs from "fs";

/**
 * Gets the inputs from the inputs folder
 * @async
 * @method
 * @param {String} dir - The path to the inputs folder
 * @returns {Array} - The inputs
 */
export const getTestFiles = async (dir) =>{
    const inputList = [];

    for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.txt'))) {
        inputList.push(file);
    }

    return inputList;
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 * @param {Bool} firstLine - If the user wants to read the first line only
 * @return {Array<Object>} - The contents of the file
 */
export const readInput = async (filePath, firstLine) => {
    try {
        const contents = [], stream = fs.createReadStream(filePath);

        let i = 0;

        const reader = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        for await (const line of reader) {
            const [A, B, C] = line.split(' ');

            if (firstLine) {
                return {
                    contents: `${A} ${B} ${C}`
                };
            }
            else {
                if (i != 0) contents.push({ id: parseInt(A), arrival: parseInt(B), burst: parseInt(C) });
            }

            i++;
        }

        return { contents };
    }
    catch (e) {
        return { error: `Invalid Filename or File does not exist.` }
    }
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 * @return {Array<Object>} - The contents of the file
 */
export const readOutput = async (filePath) => {
    const contents = [], stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        contents.push(line);
    }

    return contents;
}


/**
 * Gets the processes from the user
 * @async
 * @method
 * @param {Number} filePath - The path to the input file
 * @returns {Array} - Array of Processes
 */
export const getProcesses = async (filePath) => {
    let valid = true, processes = [];

    return await readInput(filePath);

    // Get the processes from the user
    // for (let i = 0; i < limit; i++) {
    //     const { answer, error } = await cli.ask(`Enter Process ${i + 1}: `, !valid);

    //     if (error) return cli.error(error);

    //     const [id, arrival, burst] = answer.split(' ').map(v => { return parseInt(v) });

    //     // Check if the values are valid
    //     if (isNaN(arrival) || isNaN(id) || (id <= 0)) {
    //         valid = false;
    //         i--;
    //     }
    //     else {
    //         valid = true;
    //         processes.push({ id, arrival, burst });
    //     }
    // }

    return processes;
}

/**
 * Display Results and Ask the user if they want to try another algorithm
 * @async
 * @method
 * @param {Array<String>} results - Results of the test
 * @returns {Boolean} - If the user wants to reset
 */
export const display = async (results) => {
    let reset = false;

    do {
        cli.info(`\nResults of the Process:`, { clear: false, color: 'yellow' });

        cli.info(`${results.join('\n')}\n`);

        const { answer, error } = await cli.ask(`Try another algorithm? (Y/n) `, reset);

        if (error) return cli.error(error);

        if (answer.toLowerCase() === 'exit' || answer.toLowerCase() === 'n') {
            return false;
        }
        else if (answer.toLowerCase() === 'y') {
            return true;
        }
        else {
            reset = true;
        }
    } while (reset);
}