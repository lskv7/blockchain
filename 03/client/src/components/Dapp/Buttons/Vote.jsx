import useEth from "../../../contexts/EthContext/useEth";
import {Button} from "antd";
import {useVoter} from "../../../contexts/EthContext/useVoter";
import {useStatus} from "../../../contexts/EthContext/useStatus";

function Vote({proposalId}) {
    const {state: {contract, accounts}} = useEth();
    const isVoter = useVoter();
    const status = useStatus();

    const add = async () => {
        if (!proposalId) {
            alert("Please enter a proposal for the vote.");
            return;
        }
        await contract.methods.setVote(proposalId).send({from: accounts[0]});
    }

    return (<>
        <Button type="primary" disabled={!(isVoter && status == 3)} onClick={async () => await add()}>Vote</Button>
    </>);
}

export default Vote;
