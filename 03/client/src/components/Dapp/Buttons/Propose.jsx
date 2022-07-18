import {useState} from "react";
import useEth from "../../../contexts/EthContext/useEth";
import {Button, Modal} from "antd";

function Propose() {
    const {state: {contract, accounts}} = useEth();
    const [newProposal, setNewProposal] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const add = async () => {
        if (newProposal === "") {
            alert("Please enter a description for the proposal.");
            return;
        }
        await contract.methods.addProposal(newProposal).send({from: accounts[0]});
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        await add();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (<>
        <Button style={{textAlign: "right"}} type="primary" onClick={showModal}>
            Add Proposal
        </Button>

        <Modal title="Add Proposal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <input onChange={(value) => setNewProposal(value.target.value)}/>
        </Modal>
    </>);
}

export default Propose;
