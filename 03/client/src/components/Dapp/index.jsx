import {useVoter} from "../../contexts/EthContext/useVoter";
import {useStatus} from "../../contexts/EthContext/useStatus";
import Proposals from "./Proposals";
import Propose from "./Buttons/Propose";
import {useOwner} from "../../contexts/EthContext/useOwner";
import Workflow from "./Buttons/Workflow";
import WhiteList from "./Buttons/WhiteList";

function Dapp() {
    const isVoter = useVoter();
    const isOwner = useOwner();
    const status = useStatus();
    return (
        <>
            <div style={{display: "flex", justifyContent: "end"}}>
                {(isVoter && status == 1) && <Propose/>}
                {(isOwner && status == 0) && (<WhiteList/>)}
                <Workflow/>
            </div>
            <Proposals/>
        </>
    );
}

export default Dapp;
