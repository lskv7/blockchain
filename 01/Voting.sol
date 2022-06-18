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
    /// @dev current status of the process
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint public winningProposalId;

    Proposal[] public proposals;

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
        require(_status == uint(status), "Not possible in this current status");
        _;
    }

    /// @dev Get a specific voter by his address
    function getVoter(address _address) external view isWhiteListed returns (Voter memory){
        return voters[_address];
    }

    /// @dev get all proposals
    function getProposals() external view isWhiteListed returns (Proposal[] memory){
        return proposals;
    }

    /// @dev get current status
    function getStatus() external view isWhiteListed returns (WorkflowStatus){
        return status;
    }

    /// @dev add a voter by his address
    function addVoter(address _address) external onlyOwner isStatusIn(0) {
        require(!voters[_address].isRegistered, "voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    /// @dev start proposal's registration phase
    function startProposalsRegistration() external onlyOwner isStatusIn(0) {
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    /// @dev end proposal's registration phase
    function endProposalsRegistration() external onlyOwner isStatusIn(1) {
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    /// @dev add proposal
    function addProposal(string memory _description) external isWhiteListed isStatusIn(1) {
        Proposal memory proposal;
        proposal.description = _description;
        proposals.push(proposal);
        emit ProposalRegistered(proposals.length - 1);
    }

    /// @dev start voting phase
    function startVotingSession() external onlyOwner isStatusIn(2) {
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    /// @dev add vote to the specified proposal
    function addVote(uint _proposalId) external isWhiteListed isStatusIn(3) {
        require(!voters[msg.sender].hasVoted, "user has already voted");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    /// @dev end voting phase
    function endVotingSession() external onlyOwner isStatusIn(3) {
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    /* @dev calculate winning proposal
    *
    */
    function setWinningProposal() external onlyOwner isStatusIn(4) {
        uint _winningProposalId;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > proposals[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalId = _winningProposalId;
        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
    }

}