# CPU Scheduler Simulator
A simple Node.js Project that simulates of basic CPU scheduling algorithms that conforms to the input-output format using `.txt` files. This Machine Project is submitted to Sir Jonathan Mantua as part of the deliverables for the partial completion for the course CSOPESY at De La Salle University.

## Prerequisites
The project requires the following to run:
- [Node.js®](https://nodejs.org/en/download/)
- npm (this is included when you download Node.js)

## Running Locally
At the root of the folder (and assuming you have downloaded the prerequisites),
1. Run `npm i` in your terminal.
2. Place your input file at the root of the folder. Default is `input.txt`.
3. Run `npm start` in your terminal.

## Algorithms
The basic CPU scheduling algorithms showcased are:
1. First-Come-First-Serve (FCFS)
2. Shortest-Job First (SJF)
3. Shortest-Remaining-Time-First (SRTF)
4. Round-Robin (RR)  

## NPM Packages Used
1. [chalk](https://www.npmjs.com/package/chalk) - for colored terminal output
2. [vitest](https://www.npmjs.com/package/vitest) - for testing the output of the program automatically
