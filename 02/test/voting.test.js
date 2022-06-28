const Voting = artifacts.require("./contracts/Voting.sol");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('Voting', accounts => {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const notRegisteredVoter = accounts[4];

    let votingInstance;

    const expectWorkflowStatusUpdate = async (_result, _id) => {
        const status = await votingInstance.workflowStatus.call();
        expect(new BN(status)).to.be.bignumber.equal(new BN(_id));
        expectEvent(_result, "WorkflowStatusChange", {'0': new BN(_id - 1), '1': new BN(_id)});
    }

    const initVoting = async () => {
        await votingInstance.addVoter(voter1, {from: owner});
        await votingInstance.addVoter(voter2, {from: owner});
        await votingInstance.addVoter(voter3, {from: owner});

        await votingInstance.startProposalsRegistering({from: owner});
        await votingInstance.addProposal("first prop", {from: voter1});
        await votingInstance.addProposal("second prop", {from: voter2});
        await votingInstance.endProposalsRegistering({from: owner});
    }

    const initTally = async () => {
        await initVoting();
        await votingInstance.startVotingSession({from: owner});
        await votingInstance.setVote(new BN(1), {from: voter1});
        await votingInstance.setVote(new BN(1), {from: voter2});
        await votingInstance.setVote(new BN(0), {from: voter3});
        await votingInstance.endVotingSession({from: owner});
    }

    describe("testing workflow", () => {

        before(async () => {
            votingInstance = await Voting.new({from: owner});
            await votingInstance.addVoter(voter1);
            await votingInstance.addVoter(voter2);
        });

        it('should starting status to 0', async () => {
            const status = await votingInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(0));
        });

        it("should not add proposal when not registering, revert", async () => {
            await expectRevert(votingInstance.addProposal("new proposal", {from: voter1}), "Proposals are not allowed yet");
        });

        it('should set proposal registering starting status to 1', async () => {
            const result = await votingInstance.startProposalsRegistering({from: owner});
            await expectWorkflowStatusUpdate(result, 1);
        });


        it("should not add empty proposal , revert", async () => {
            await expectRevert(votingInstance.addProposal("", {from: voter1}), "Vous ne pouvez pas ne rien proposer");
        });

        it('should set proposal registering ending status to 2', async () => {
            await votingInstance.addProposal(voter1, {from: voter1});
            const result = await votingInstance.endProposalsRegistering({from: owner});
            await expectWorkflowStatusUpdate(result, 2);
        });

        it('should set voting session starting status to 3', async () => {
            const result = await votingInstance.startVotingSession({from: owner});
            await expectWorkflowStatusUpdate(result, 3);
        });

        it('should set voting session ending status to 4', async () => {
            await votingInstance.setVote(0, {from: voter2});
            const result = await votingInstance.endVotingSession({from: owner});
            await expectWorkflowStatusUpdate(result, 4);
        });

        it('should set tally status to 5', async () => {
            const result = await votingInstance.tallyVotes({from: owner});
            await expectWorkflowStatusUpdate(result, 5);
        });
    })

    describe("testing voter registering phase", () => {

        before(async () => {
            votingInstance = await Voting.new({from: owner});
        });
        it('should not be able to add voter if sender is not owner', async () => {
            await expectRevert(votingInstance.addVoter(voter2, {from: voter2}), "Ownable: caller is not the owner");
        });

        it('should add voter', async () => {
            const result = await votingInstance.addVoter(voter1, {from: owner});
            expectEvent(result, "VoterRegistered", {voterAddress: voter1});
            const voter = await votingInstance.getVoter(voter1, {from: voter1});
            expect(voter.isRegistered).to.equal(true);
        });

        it('should not be able to add voter if already exists', async () => {
            await expectRevert(votingInstance.addVoter(voter1, {from: owner}), "Already registered");
        });

        it("should not add voter when status is not 0", async () => {
            await votingInstance.startProposalsRegistering({from: owner});
            await expectRevert(votingInstance.addVoter(voter1, {from: owner}), "Voters registration is not open yet");
        });
    });

    describe('test voting phase', () => {

        before(async () => {
            votingInstance = await Voting.new({from: owner});
            await initVoting();
        });
        it("should not be able to vote when status is 2", async () => {
            await expectRevert(votingInstance.setVote(new BN(1), {from: voter1}), "Voting session havent started yet");
        });

        it('should vote only if registered', async () => {
            await votingInstance.startVotingSession({from: owner});
            await expectRevert(votingInstance.setVote(new BN(1), {from: notRegisteredVoter}), "You're not a voter");
        });

        it('should vote for a proposal', async () => {
            const result = await votingInstance.setVote(new BN(1), {from: voter1});
            const voter = await votingInstance.getVoter(voter1, {from: voter1});
            expect(voter.hasVoted).to.equal(true);
            expect(voter.votedProposalId).to.be.bignumber.equal(new BN(1));
            expectEvent(result, "Voted", {voter: voter1, proposalId: new BN(1)});
        });

        it('should not be able to vote for a second time', async () => {
            await expectRevert(votingInstance.setVote(new BN(1), {from: voter1}), "You have already voted");
        });

        it('should not vote for not registered proposal', async () => {
            await expectRevert(votingInstance.setVote(new BN(100), {from: voter2}), "Proposal not found");
        });
    });

    describe('test tally phase', () => {

        before(async () => {
            votingInstance = await Voting.new({from: owner});
            await initTally();
            await votingInstance.tallyVotes({from: owner});
        });

        it('should winning proposal id be 1', async () => {
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(new BN(1));
        });
    })

})