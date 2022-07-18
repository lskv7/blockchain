import useEth from "./useEth";
import {useEffect, useState} from "react";

export const useStatus = () => {
    const {state: {contract}} = useEth();
    const [status, setStatus] = useState(0)

    useEffect(() => {
        const _init = async () => {
            setStatus(await contract.methods.workflowStatus().call());
            contract.events.WorkflowStatusChange({  fromBlock: 0 }).on('data', event => setStatus(event.returnValues.newStatus))
        }
        if (contract) {
            _init()
        }
    }, [contract]);

    return status;
};