import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import HandleWorkflow from "./HandleWorkflow";
import Title from "../Demo/Title";

function Workflow() {
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

    return (
        <>
            <Title title={"Workflow"}/>
            {!isOwner ? "You don't have access to this resource" :
                <HandleWorkflow/>}
        </>
    );
}

export default Workflow;
