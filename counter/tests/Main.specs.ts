import { Address, Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { MainContract } from "../wrappers/MainContract";
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe("main.fc contract tests", () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Counter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<MainContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const defaultAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

        counter = blockchain.openContract(
            MainContract.createFromConfig(
                {
                    number: 0,
                    address: defaultAddress,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });


    it("should successfully increase counter in contract and get the proper most recent sender address", async () => {
        const blockchain = await Blockchain.create();
        // const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

        const initAddress = await blockchain.treasury("initAddress");

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(
                {
                    number: 0,
                    address: initAddress.address,
                },
                code
            )
        );

        const senderWallet = await blockchain.treasury("sender");

        const sentMessageResult = await myContract.sendIncrement(
            senderWallet.getSender(),
            toNano("0.05"),
            1
        );

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
        expect(data.number).toEqual(1);
    });
});