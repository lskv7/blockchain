import useEth from "./useEth";
import {useEffect, useState} from "react";


export const useProposals = () => {
    const [proposals, setProposals] = useState([]);
    const {state: {contract, accounts}} = useEth();

    const getProposal = async (e) => {
        const proposal = await contract.methods.getOneProposal(e.returnValues.proposalId).call({from: accounts[0]})
        return {id: e.returnValues.proposalId, description: proposal.description, voteCount: proposal.voteCount};
    }

    const getProposals=async ()=>{
        let options = {
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
        };
        const events = await contract.getPastEvents('ProposalRegistered', options)
        const _proposals = await Promise.all(events.map(async e => {
            return getProposal(e)
        }));
        setProposals(_proposals)
    }

    useEffect(() => {
        const init = async () => {

            if (contract && accounts) {
                await getProposals()
                contract.events.ProposalRegistered().on('data', async e => await getProposals())
                contract.events.Voted().on('data', async e => await getProposals())
            }
        }
        init();

    }, [contract, accounts]);

    return proposals;
};