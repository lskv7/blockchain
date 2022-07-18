import useEth from "./useEth";
import {useEffect, useState} from "react";


export const useProposals = () => {
    const [proposals, setProposals] = useState([]);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        const init = async () => {
            let options = {
                fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            if (contract && accounts) {
                const events = await contract.getPastEvents('ProposalRegistered', options)
                const _proposals = await Promise.all(events.map(async e => {
                    const proposal = await contract.methods.getOneProposal(e.returnValues.proposalId).call({from: accounts[0]})
                    return {id:e.returnValues.proposalId, description:proposal.description, voteCount:proposal.voteCount};
                }));
                console.log(_proposals)
                setProposals(_proposals)
            }
        }
        init();

    }, [contract, accounts]);

    return proposals;
};