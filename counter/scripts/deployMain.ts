import { toNano, Address } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let address = provider.sender().address;
    if (!address) {
        throw new Error('No address found');
    }
    const counter = provider.open(
        MainContract.createFromConfig(
            {
                number: 0,
                address: address,
            },
            await compile('MainContract')
        )
    );

    await counter.sendDeploy(provider.sender(), toNano('0.05'));

    const ATTEMPTS = 3;
    await provider.waitForDeploy(counter.address, ATTEMPTS);

    console.log('Counter value', await counter.getData());
}
