import { getInputs } from "../utils/read.js";

// Name of the Algorithm
export const name = `Round Robin`;

/**
 * First Come First Serve Algorithm
 * @module models/rr
 * @async
 * @method
 */
export const execute = async () => {
    const inputs = await getInputs();

    // TODO
    console.log(inputs);
}