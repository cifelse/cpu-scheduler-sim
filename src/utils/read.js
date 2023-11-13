import readline from "readline";
import fs from "fs";

/**
 * Gets the inputs from the inputs folder
 * @async
 * @method
 * @returns {Map} - The inputs
 */
export const getInputs = async () =>{
    const inputs = new Map();

    for (const file of fs.readdirSync('././inputs').filter(file => file.endsWith('.txt'))) {
        const input = await read(`././inputs/${file}`);
        inputs.set(file.split('.')[0], input);
    }

    return inputs;
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