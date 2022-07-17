import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "../Title";

function Propose() {
    const {state: {contract, accounts}} = useEth();
    const [newProposal, setNewProposal] = useState()
    useEffect(() => {

    }, []);

    const add = async () => {
        if (newProposal === "") {
            alert("Please enter a description for the proposal.");
            return;
        }
        await contract.methods.addProposal(newProposal).send({from: accounts[0]});
    }

    return (<>
        <Title title={"Proposal"}/>
        <input onChange={(value) => setNewProposal(value.target.value)}/>
        <button onClick={async () => await add()}>Add Proposal</button>
    </>);
}

export default Propose;
