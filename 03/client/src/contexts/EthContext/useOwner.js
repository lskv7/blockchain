import useEth from "./useEth";
import {useEffect, useState} from "react";

export const useOwner = () => {
    const [isOwner, setIsOwner] = useState(false);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        const init = async () => {
            if (contract && accounts) {
                const owner = await contract.methods.owner().call();
                setIsOwner(owner === accounts[0])
            }
        }
        init();

    }, [contract, accounts]);

    return isOwner;
};