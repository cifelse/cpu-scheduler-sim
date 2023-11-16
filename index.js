import { cli } from "./src/utils/cli.js";
import fs from "fs";

const models = new Map(), table = [
    { algorithm: 'First Come First Serve', abbreviation: 'FCFS' },
    { algorithm: 'Shortest Job First', abbreviation: 'SJF' },
    { algorithm: 'Shortest Remaining Time First', abbreviation: 'SRTF' },
    { algorithm: 'Round Robin', abbreviation: 'RR' }
];

for (const file of fs.readdirSync('./src/models').filter(file => file.endsWith('.js'))) {
    const model = await import(`./src/models/${file}`);
    models.set(file.split('.')[0], model);

    // table.push({ algorithm: model.name, abbreviation: file.split('.')[0].toUpperCase() });
}

/**
 * Checks the validity of the user's response
 * @async
 * @method
 * @param {String} response - The choice of the user
 * @return {Boolean} - If the user's response is valid
 */
const isValid = async (response) => {
    response = (response === '0') ? 0 : (parseInt(response) || response);

    // If the choice is not a number or is not within the range of the table
    return ((typeof response) === 'number') && (response >= 0) && (response < (table.length));
}

/**
 * Main Function
 */
(async () => {
    let valid = true, reset = false;

    do {
        cli.info(`Welcome to the CPU Scheduling Simulator!`, true);

        // Display the table of algorithms
        cli.table(table);

        // Ask the User using the CLI
        const { answer, error } = await cli.ask(`Using the index, choose which algorithm to use: `, !valid);

        // If there is an error, print it to the console
        if (error) return cli.error(error);
        
        if (answer.toLowerCase() === 'exit') reset = false;
            
        else {
            // Check if the user's response is valid
            valid = await isValid(answer);

            // Reroute the user to the chosen algorithm
            reset = (!valid) ? true : await models.get(table[parseInt(answer)].abbreviation.toLowerCase()).execute();
        }
    }
    while (reset);

    cli.info(`\nThank you for using this program!`);
})();
