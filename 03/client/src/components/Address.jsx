import useEth from "../contexts/EthContext/useEth";
import {Button} from "antd";

function Address() {
    const {state: {accounts}} = useEth();

    return (
        <div id={"address"}><span>{accounts && <Button>{accounts[0]}</Button>}</span></div>
    );
}

export default Address;
