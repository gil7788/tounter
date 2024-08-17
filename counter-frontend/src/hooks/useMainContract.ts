import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
    const client = useTonClient();
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();
    const sender = useTonConnect().sender;

    const [balance, setBalance] = useState<number | null>(null);
    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("EQBUmP8ApLgxMtBpQnwIVmjylRSNuI8dkrCSfSH9PnQjxa7K"),
        );
        if (!contract.init) {
            throw new Error("Contract not initialized");
        }

        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const balance = (await mainContract.getBalance()).number;
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address,
            });
            setBalance(balance);
            await sleep(1000);
            getValue();
        }
        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        contract_balance: balance,
        ...contractData,
        sendIncrement: () => {
            return mainContract?.sendIncrement(sender, toNano(0.05), 5);
        },
    };
}