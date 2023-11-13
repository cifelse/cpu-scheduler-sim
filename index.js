import { cli } from "./src/utils/cli.js";
import fs from 'fs';

const models = new Map(), table = [];

for (const file of fs.readdirSync('./src/models').filter(file => file.endsWith('.js'))) {
    const model = await import(`./src/models/${file}`);
    table.push({ algorithm: model.name, abbreviation: file.split('.')[0].toUpperCase() });
    models.set(file.split('.')[0], model);
}

/**
 * Routes the user to the chosen algorithm
 * @param {String} choice - The choice of the user
 */
const reroute = async (choice) => {
    switch (choice.toUpperCase()) {
        case '0':
        case 'FCFS':
            cli.info(`You have chosen ${table[0].algorithm}!`, true);
            await models.get('fcfs').execute();
            break;
        case '1':
        case 'SJF':
            cli.info(`You have chosen ${table[1].algorithm}!`, true);
            await models.get('sjf').execute();
            break;
        case '2':
        case 'SRTF': 
            cli.info(`You have chosen ${table[2].algorithm}!`, true);
            await models.get('srtf').execute();
            break;
        case '3':
        case 'RR':
            cli.info(`You have chosen ${table[3].algorithm}!`, true);
            await models.get('rr').execute();
            break;
        default: 
            return false;
    }

    return true;
}

/**
 * Main Function
 */
(async () => {
    let res = true;

    do {
        cli.table(table, true);

        const { answer, error } = await cli.ask(`Using the index, choose which algorithm to use: `, !res);

        if (error) return cli.error(error);

        res = await reroute(answer);
    }
    while (!res);
})();
