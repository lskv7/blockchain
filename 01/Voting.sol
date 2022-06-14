// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint public winningProposalId;

    Proposal[] proposals;

    WorkflowStatus status;

    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier isWhiteListed() {
        require(voters[msg.sender].isRegistered, "not in white list");
        _;
    }

    modifier isStatusIn(uint _status) {
        require(_status==uint(status), "Not possible in this current status");
        _;
    }

    function getVoter(address _address) external view isWhiteListed returns (Voter memory){
        return voters[_address];
    }

    function getProposals() external view isWhiteListed returns(Proposal[] memory){
        return proposals;
    }

    function getStatus() external view isWhiteListed returns(WorkflowStatus){
        return status;
    }

    function addVoter(address _address) external onlyOwner isStatusIn(0) {
        require(!voters[_address].isRegistered, "voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function startProposalsRegistration() external onlyOwner isStatusIn(0){
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    function endProposalsRegistration() external onlyOwner isStatusIn(1) {
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    function addProposal(string memory _description) external isWhiteListed isStatusIn(1){
        Proposal memory proposal;
        proposal.description = _description;
        proposals.push(proposal);
        emit ProposalRegistered(proposals.length-1);
    }

    function startVotingSession() external onlyOwner isStatusIn(2){
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    function addVote(uint _proposalId) external isWhiteListed isStatusIn(3){
        require(!voters[msg.sender].hasVoted, "user has already voted");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        emit Voted (msg.sender, _proposalId);
    }

    function endVotingSession() external onlyOwner isStatusIn(3){
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    function setWinningProposal() external onlyOwner isStatusIn(4){
        uint _winningProposalId;
        for (uint p = 0; p < proposals.length; p++){
            if (proposals[p].voteCount > proposals[_winningProposalId].voteCount){
                _winningProposalId = p;
            }
        }
        winningProposalId = _winningProposalId;
        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
    }

}