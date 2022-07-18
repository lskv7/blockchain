import useEth from "./useEth";
import {useEffect, useState} from "react";

export const useVoter = () => {
    const [isVoter, setIsVoter] = useState(false);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        const init = async () => {
            if (contract && accounts) {
                await checkIsVoter();
                contract.events.VoterRegistered({fromBlock: 0}).on('data', async e => await checkIsVoter())
            }
        }
        init();

    }, [contract, accounts]);

    const checkIsVoter = async () => {
        const events = await contract.getPastEvents('VoterRegistered', {fromBlock: 0})
        const voters = events.map(e => e.returnValues.voterAddress)
        setIsVoter(voters.includes(accounts[0]))
    }

    return isVoter;
};