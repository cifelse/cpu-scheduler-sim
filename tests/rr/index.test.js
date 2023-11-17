import { expect, test } from "vitest";
import { getTestFiles, readInput, readOutput } from "../../src/utils/io.js";
import { rr } from "../../src/models/rr.js";
import { quantums } from "./quantum.config.js";

const DIR = './tests/rr/';

const testFiles = await getTestFiles(DIR);
const inputFiles = testFiles.filter(file => file.startsWith('input'));
const outputFiles = testFiles.filter(file => file.startsWith('output'));

test('Input Files have equivalent Output Files', async () => {
    // If the flag is true, then all input files have an equivalent output file
    expect(outputFiles).toStrictEqual(inputFiles.map(file => file.replace('input', 'output')));
});

// Test each input file
for (const file of inputFiles) {
    test(`Input File ${file} has exact results as equivalent Output File`, async () => {
        const processes = await readInput(DIR + file);
        
        const outputFile = file.replace('input', 'output');

        const expected = await readOutput(DIR + outputFile);

        const q = quantums.get(file);
        
        const actual = await rr(processes, q);
        
        expect(expected).toEqual(actual);
    });
}