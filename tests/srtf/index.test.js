import { expect, test } from "vitest";
import { getTestFiles, readInput, readOutput } from "../../src/utils/io.js";
import { srtf } from "../../src/models/srtf.js";

const DIR = './tests/sjf/';

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
        
        const actual = await srtf(processes, q);
        
        expect(expected).toEqual(actual);
    });
}