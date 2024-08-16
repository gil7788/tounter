// TODO need to correct - probably init from address by reading address state from the blockchain
// Instead of create from config

import { Address, toNano, Cell } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // Get the contract address from the user or args
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('MainContract address'));

    // Check if the contract is deployed at the provided address
    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }
    // const mainContract = provider.open(MainContract.createFromAddress(address));
    const mainContract = provider.open(MainContract.createFromConfig(
        {
            number: 0,
            address: address,
            owner_address: address,
        },
        await loadContractCode()
    ));

    // Get the current contract data (including the number)
    const dataBefore = await mainContract.getData();

    // Define the increment value
    const incrementValue = 1; // You can adjust this as needed

    // Send the increment transaction
    await mainContract.sendIncrement(provider.sender(), toNano('0.15'), incrementValue);

    ui.write('Waiting for the number to increase...');

    // Polling loop to check if the number has been incremented
    let dataAfter = await mainContract.getData();
    let attempt = 1;
    while (dataAfter.number === dataBefore.number) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        dataAfter = await mainContract.getData();
        attempt++;
    }

    // Clear the action prompt and print the results
    ui.clearActionPrompt();
    ui.write('Number increased successfully!');
    ui.write(`New number: ${dataAfter.number}`);
    ui.write(`Increased by: ${incrementValue}`);
    ui.write(`Recent sender: ${dataAfter.recent_sender}`);
}

// Placeholder function to load the contract code (this must be implemented based on your setup)
async function loadContractCode(): Promise<Cell> {
    // Load the compiled contract code here (this might come from a file or other source)
    return new Cell(); // Replace with actual contract code loading logic
}
