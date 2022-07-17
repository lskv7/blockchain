import useEth from "../../contexts/EthContext/useEth";
import {useStatus} from "../../contexts/EthContext/useStatus";
import Title from "../Title";
import WhiteList from "./WhiteList";
import Tally from "./Tally";
import {useOwner} from "../../contexts/EthContext/useOwner";

function Admin() {
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

    return (<>
        <Title title={"Workflow"}/>
        {status == 0 && <button onClick={async () => await startProposal()}>Start proposal registration</button>}
        {status == 1 && <button onClick={async () => await endProposal()}>End proposal registration</button>}
        {status == 2 && <button onClick={async () => await startVoting()}>Start voting session</button>}
        {status == 3 && <button onClick={async () => await endVoting()}>End voting session</button>}
        {(status == 0 && isOwner) && (<WhiteList/>)}
        {(status == 4 && isOwner) && <Tally/>}
    </>);
}

export default Admin;
