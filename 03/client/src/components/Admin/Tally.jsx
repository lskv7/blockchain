import useEth from "../../contexts/EthContext/useEth";
import {useOwner} from "../../contexts/EthContext/useOwner";
import Title from "../Title";

function Tally() {
    const {state: {contract, accounts}} = useEth();
    const isOwner = useOwner();


    const tally = async () => {
        await contract.methods.tallyVotes().send({from: accounts[0]});
    }
    return (
        <>
            <Title title={"Tally"}/>
            {!isOwner ? "You don't have access to this resource" :
                <button onClick={async () => await tally()}>Tally</button>}
        </>
    );
}

export default Tally;
