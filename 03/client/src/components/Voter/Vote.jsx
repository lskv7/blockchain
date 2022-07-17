import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "../Title";

function Vote() {
    const {state: {contract, accounts}} = useEth();
    const [proposals, setProposals] = useState([])

    const [proposalId, setProposalId] = useState()
    useEffect(() => {
        const _init = async () => {
            let options = {
                fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            const _proposals = await contract.getPastEvents('ProposalRegistered', options)
            setProposals(_proposals);
            if (_proposals.length > 0) {
                setProposalId(_proposals[0].returnValues.proposalId)
            }
            console.log(_proposals)
        }
        _init();

    }, []);

    const add = async () => {
        console.log(proposalId)
        if (!proposalId) {
            alert("Please enter a description for the vote.");
            return;
        }
        await contract.methods.setVote(proposalId).send({from: accounts[0]});
    }

    return (<>
        <Title title={"Vote"}/>

        <select onChange={(value) => setProposalId(value)}>
        {proposals.map((value, index) => {
            return <option key={value.returnValues.proposalId}>{value.returnValues.proposalId}</option>
        })}
    </select>
        <button onClick={async () => await add()}>Add Vote</button>
    </>);
}

export default Vote;
