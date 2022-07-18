import {useEffect, useState} from "react";
import useEth from "../../../contexts/EthContext/useEth";
import {Button, Modal} from "antd";

function WhiteList() {
    const {state: {contract, accounts}} = useEth();
    const [newVoter, setNewVoter] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);

    const add = async () => {
        if (newVoter === "") {
            alert("Please enter an address for the voter.");
            return;
        }
        await contract.methods.addVoter(newVoter).send({from: accounts[0]});
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
            Add Voter
        </Button>

        <Modal title="Add Voter" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <input onChange={(value) => setNewVoter(value.target.value)}/>
        </Modal>
    </>);
}

export default WhiteList;
