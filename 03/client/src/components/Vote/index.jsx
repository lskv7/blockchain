import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import Add from "./Add";
import Title from "../Demo/Title";

function Vote() {
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
            <Title title={"Vote"}/>
            {!isOwner ? "You don't have access to this resource" :
                <Add/>}
        </>
    );
}

export default Vote;
