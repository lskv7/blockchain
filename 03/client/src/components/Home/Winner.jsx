import useEth from "../../contexts/EthContext/useEth";
import {useStatus} from "../../contexts/EthContext/useStatus";
import {useEffect, useState} from "react";
import Title from "../Title";

function Winner() {
    const {state: {contract}} = useEth();
    const status = useStatus();
    const [winner, setWinner] = useState()

    useEffect(() => {
        const _init = async () => {
            if (contract){
            const _winner = await contract.methods.winningProposalID().call();
            setWinner(_winner);
            }
        }
        _init();

    }, [contract]);
    console.log(status == 5)

    return (<>
        <Title title={"Winning Proposal"}/>
        <span> {status == 5 ? `The most voted proposal is ${winner}` : "There is no winning proposal at the moment"} </span>
    </>);
}

export default Winner;
