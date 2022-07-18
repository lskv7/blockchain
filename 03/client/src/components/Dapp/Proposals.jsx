import useEth from "../../contexts/EthContext/useEth";
import {useStatus} from "../../contexts/EthContext/useStatus";
import {createElement, FC, useEffect, useState} from "react";
import Title from "../Title";
import {useProposals} from "../../contexts/EthContext/useProposals";
import {List, Space,} from "antd";
import Winner from "./Winner";
import {LikeOutlined} from '@ant-design/icons';
import Vote from "./Buttons/Vote";

const IconText = ({ icon, text }: { icon: FC; text: string }) => (
    <Space>
        {createElement(icon)}
        {text}
    </Space>
);
function Proposals() {
    const {state: {contract}} = useEth();
    const status = useStatus();
    const proposals=useProposals();
    const [winner, setWinner] = useState()

    useEffect(() => {
        const _init = async () => {
            if (contract){
            const _winner = await contract.methods.winningProposalID().call();
            setWinner(_winner);
            }
        }
        _init();

    }, [contract]);

    return (<>
        <Title title={"Proposals"}/>
        <div>
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 3,
            }}
            dataSource={proposals}

            header={
                <div>
                    <Winner/>
                </div>
            }
            renderItem={item => (
                <List.Item
                    key={item.id}
                    actions={[
                        <IconText icon={LikeOutlined} text={item.voteCount} key="list-vertical-like-o" />,
                        <Vote proposalId={item.id}/>
                    ]}

                >
                    <List.Item.Meta
                        title={item.description}
                        description={`This proposal has id : ${item.id}`}
                    />
                </List.Item>
            )}
        />
        </div>
    </>);
}

export default Proposals;
