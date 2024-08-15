const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, 'wrappers');

function getContractFiles() {
    return fs.readdirSync(wrappersDir)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.compile.ts'))
        .map(file => path.basename(file, '.ts')); // Remove the .ts suffix for display
}

async function selectAndBuild() {
    const contracts = getContractFiles();

    if (contracts.length === 0) {
        console.log('No valid contracts found in the wrappers directory.');
        return;
    }

    const { selectedContract } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedContract',
            message: 'Choose contract to build:',
            choices: contracts,
        },
    ]);

    try {
        execSync(`./node_modules/.bin/blueprint build ${selectedContract}`, { stdio: 'inherit' });
    } catch (error) {
        console.error('Error during build:', error);
    }
}

selectAndBuild();
