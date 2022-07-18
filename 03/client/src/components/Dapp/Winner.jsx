import useEth from "../../contexts/EthContext/useEth";
import {useStatus} from "../../contexts/EthContext/useStatus";
import {useEffect, useState} from "react";
import Title from "../Title";
import {Alert} from "antd";

function Winner() {
    const {state: {contract}} = useEth();
    const status = useStatus();
    const [winner, setWinner] = useState()

    useEffect(() => {
        const _init = async () => {
            if (contract) {
                const _winner = await contract.methods.winningProposalID().call();
                setWinner(_winner);
            }
        }
        _init();

    }, [contract]);

    return (<>
        {status == 5 && <Alert message={`The most voted proposal is ${winner}`} type="success"/>}
    </>);
}

export default Winner;
