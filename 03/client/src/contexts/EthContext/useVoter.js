import useEth from "./useEth";
import {useEffect, useState} from "react";

export const useVoter = () => {
    const [isVoter, setIsVoter] = useState(false);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        const init = async () => {
            let options = {
                fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            if (contract && accounts) {
                const events = await contract.getPastEvents('VoterRegistered', options)
                const voters = events.map(e => e.returnValues.voterAddress)
                setIsVoter(voters.includes(accounts[0]))
            }
        }
        init();

    }, [contract, accounts]);

    return isVoter;
};