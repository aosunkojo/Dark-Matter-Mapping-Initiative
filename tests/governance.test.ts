import { describe, it, expect } from 'vitest';

// Simulating the contract state
let governanceTokens = new Map<string, number>();
let proposals = new Map<number, { description: string, votesFor: number, votesAgainst: number, status: string }>();
let nextProposalId = 0;

// Simulating contract functions
function mintTokens(address: string, amount: number): boolean {
  const currentBalance = governanceTokens.get(address) || 0;
  governanceTokens.set(address, currentBalance + amount);
  return true;
}

function createProposal(description: string): number {
  const id = nextProposalId++;
  proposals.set(id, { description, votesFor: 0, votesAgainst: 0, status: 'active' });
  return id;
}

function vote(proposalId: number, inFavor: boolean, voter: string): boolean {
  const proposal = proposals.get(proposalId);
  if (!proposal || proposal.status !== 'active') return false;
  
  const voterBalance = governanceTokens.get(voter) || 0;
  if (voterBalance === 0) return false;
  
  if (inFavor) {
    proposal.votesFor += voterBalance;
  } else {
    proposal.votesAgainst += voterBalance;
  }
  return true;
}

describe('Governance Contract', () => {
  it('should mint governance tokens', () => {
    expect(mintTokens('address1', 100)).toBe(true);
    expect(governanceTokens.get('address1')).toBe(100);
  });
  
  it('should create proposals', () => {
    const proposalId = createProposal('Test Proposal');
    expect(proposalId).toBe(0);
    expect(proposals.get(0)?.description).toBe('Test Proposal');
  });
  
  it('should allow voting on proposals', () => {
    mintTokens('voter1', 50);
    mintTokens('voter2', 30);
    const proposalId = createProposal('Voting Proposal');
    
    expect(vote(proposalId, true, 'voter1')).toBe(true);
    expect(vote(proposalId, false, 'voter2')).toBe(true);
    
    const proposal = proposals.get(proposalId);
    expect(proposal?.votesFor).toBe(50);
    expect(proposal?.votesAgainst).toBe(30);
  });
});
