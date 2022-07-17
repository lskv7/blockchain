import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";

function HandleWorkflow() {
    const {state: {contract, accounts}} = useEth();
    const [status, setStatus] = useState(0)
    useEffect(() => {
        const _init = async () => {
            setStatus(await contract.methods.workflowStatus().call());
        }
        _init()
    }, [contract]);

    const startProposal = async () => {
        await contract.methods.startProposalsRegistering().send({from: accounts[0]});
    }
    const endProposal = async () => {
        await contract.methods.endProposalsRegistering().send({from: accounts[0]});
    }
    const startVoting = async () => {
        await contract.methods.startVotingSession().send({from: accounts[0]});
    }
    const endVoting = async () => {
        await contract.methods.endVotingSession().send({from: accounts[0]});
    }
    const tally = async () => {
        await contract.methods.tallyVotes().send({from: accounts[0]});
    }

    return (<>{status == 0 && <button onClick={async () => await startProposal()}>Start proposal registration</button>}
        {status == 1 && <button onClick={async () => await endProposal()}>End proposal registration</button>}
        {status == 2 && <button onClick={async () => await startVoting()}>Start voting session</button>}
        {status == 3 && <button onClick={async () => await endVoting()}>End voting session</button>}
        {status == 4 && <button onClick={async () => await tally()}>Tally Votes</button>}


    </>);
}

export default HandleWorkflow;
