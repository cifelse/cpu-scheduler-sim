import { cli } from "./cli.js";
import readline from "readline";
import fs from "fs";

/**
 * Gets the inputs from the inputs folder
 * @async
 * @method
 * @returns {Array} - The inputs
 */
export const getInputFiles = async () =>{
    const inputList = [];

    for (const file of fs.readdirSync('././inputs').filter(file => file.endsWith('.txt'))) {
        inputList.push({ files: file });
    }

    return inputList;
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 */
export const read = async (filePath) => {
    const contents = [], stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        const [process, arrival, burst] = line.split(' ');
        contents.push({ process, arrival, burst });
    }

    return contents;
}

/**
 * Writes the data to the file
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 * @param {String} data - The data to write
 */
export const write = async (filePath, data) => {

}