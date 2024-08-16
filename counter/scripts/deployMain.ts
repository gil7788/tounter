import { address, toNano } from "@ton/core";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
    const deployerAddress = provider.sender().address;
    if (!deployerAddress) {
        throw new Error("Deployer address not found");
    }
    const myContract = MainContract.createFromConfig(
        {
            number: 0,
            address: deployerAddress,
            owner_address: deployerAddress,
        },
        await compile("MainContract")
    );

    const openedContract = provider.open(myContract);

    openedContract.sendDeploy(provider.sender(), toNano("0.1"));

    await provider.waitForDeploy(myContract.address);
}