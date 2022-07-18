import useEth from "../../../contexts/EthContext/useEth";
import {useStatus} from "../../../contexts/EthContext/useStatus";
import {useOwner} from "../../../contexts/EthContext/useOwner";
import {Button} from "antd";

function WorkFlow() {
    const {state: {contract, accounts}} = useEth();
    const isOwner = useOwner();
    const status = useStatus();

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

    return (<>
        {status == 0 && isOwner && <Button type="primary" danger onClick={async () => await startProposal()}>Start proposal registration</Button>}
        {status == 1 && isOwner && <Button type="primary" danger onClick={async () => await endProposal()}>End proposal registration</Button>}
        {status == 2 && isOwner && <Button type="primary" danger onClick={async () => await startVoting()}>Start voting session</Button>}
        {status == 3 && isOwner && <Button type="primary" danger onClick={async () => await endVoting()}>End voting session</Button>}
        {(status == 4 && isOwner) && <Button type="primary" danger onClick={async () => await tally()}>Tally</Button>}

    </>);
}

export default WorkFlow;
