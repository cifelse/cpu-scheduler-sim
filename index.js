import { cli } from "./src/utils/cli.js";
import { readInput } from "./src/utils/io.js";
import fs from "fs";

const models = new Map(), table = [];

// Import all the models
for (const file of fs.readdirSync('./src/models').filter(file => file.endsWith('.js'))) {
    const model = await import(`./src/models/${file}`);
    models.set(file.split('.')[0], model);
    table.push({ algorithm: model.name, abbreviation: file.split('.')[0].toUpperCase() });
}

/**
 * Checks the validity of the user's response
 * @async
 * @method
 * @param {String} response - The choice of the user
 * @return {Boolean} - If the user's response is valid
 */
const isValid = (response) => {
    const arr = response.split(' ');

    if (arr.length != 3) return {
        valid: false,
        error: 'Invalid number of arguments.'
    };
    
    // Parse the values to integers
    const [X, Y, Z] = arr.map(v => { return parseInt(v) });

    // Check if the response follows the specs
    if (!((typeof X) === 'number') && (X >= 0) && (X < (table.length))) return {
        valid: false,
        error: 'X must be an integer between 0 and 3.'
    };

    if (!((typeof Y) === 'number') && (Y >= 3) && (Y <= 100)) return {
        valid: false,
        error: 'Y must be an integer between 3 and 100.'
    };

    if (X == 3 && !(((typeof Z) === 'number') && (Z >= 1) && (Z <= 100))) return {
        valid: false,
        error: `Z must be an integer between 1 and 100. Your input is ${Z}.`
    }

    return {
        valid: true,
        error: ''
    };
}


/**
 * Main Function
 */
(async () => {
    let reset = false, errorMessage = '';

    do {
        cli.info(`Welcome to the CPU Scheduling Simulator!`, { clear: true });

        // Display the table of algorithms
        cli.table(table);

        cli.info(`Enter 3 integers separated by spaces to simulate a process: (X Y Z)\n`);
        
        cli.info(`X denotes the CPU scheduling algorithm. See table above.`, { color: `white` });

        cli.info(`Y denotes the number of processes to simulate, where 3 ≤ Y ≤ 100`);

        cli.info(`Z denotes the time quantum for the Round Robin algorithm, where 1 ≤ Z ≤ 100\n`, { color: `green` });

        if (errorMessage.length > 0) cli.info(errorMessage, { color: `red` });

        const { answer, error } = await cli.ask(`Enter Input Filename [input.txt]: `);

        if (error) return cli.error(error);

        // Exit
        if (answer.toLowerCase() === 'exit') reset = false;

        else {
             // Get first line of the txt file only (the config) in txt file
            const filePath = '././' + (answer.length > 0 ? answer : 'input.txt');

            const { contents: config, error: err } = await readInput(filePath, true);
            
            if (err) {
                errorMessage = err;
                reset = true;
                continue;
            }

            // Check if the user's response is valid
            const { valid, error } = isValid(config);

            errorMessage = error ?? '';

            // If answer is valid, proceed to execute chosen CPU scheduler
            reset = (!valid) ? true : await (async () => {
                const [X, Y, Z] = config.split(' ').map(v => { return parseInt(v) });

                return await models.get(table[X].abbreviation.toLowerCase()).execute(filePath, Y, (X == 1) ? Z : 1);
            })();
        }
    }
    while (reset);

    cli.info(`\nThank you for using this program!`);
})();
