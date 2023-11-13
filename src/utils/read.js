import fs from 'fs';
import readline from 'readline';

/**
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 */
export const read = async (filePath) => {
    const stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        console.log(line);
    }
}