import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "../Demo/Title";

function Tally() {
    const [isOwner, setIsOwner] = useState(false);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        const init = async () => {
            if (contract && accounts) {
                const owner = await contract.methods.owner().call();
                setIsOwner(owner === accounts[0])
            }
        }
        init();

    }, [contract, accounts]);

    const tally= async ()=>{
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
