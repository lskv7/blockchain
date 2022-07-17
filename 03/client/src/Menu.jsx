import "./App.css";
import {Tabs} from "antd";
import 'antd/dist/antd.css';
import Voter from "./components/Voter";
import Admin from "./components/Admin";
import {useOwner} from "./contexts/EthContext/useOwner";
import {useVoter} from "./contexts/EthContext/useVoter";
import Intro from "./components/Home";

function AppMenu() {
    const isOwner = useOwner();
    const isVoter = useVoter();
    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Home" key="1">
                <Intro/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Voter" disabled={!isVoter} key="2">
                <Voter/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Admin" disabled={!isOwner} key="3">
                <Admin/>
            </Tabs.TabPane>
        </Tabs>

    );
}

export default AppMenu;
