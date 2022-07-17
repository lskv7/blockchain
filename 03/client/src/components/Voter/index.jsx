import {useVoter} from "../../contexts/EthContext/useVoter";
import Vote from "./Vote";
import {useStatus} from "../../contexts/EthContext/useStatus";
import Propose from "./Propose";

function Voter() {
    const isVoter = useVoter();
    const status = useStatus();
    return (
        <>
            {(isVoter && status == "1") &&
                <Propose/>}
            {(isVoter && status == "3") &&
                <Vote/>}
        </>
    );
}

export default Voter;
