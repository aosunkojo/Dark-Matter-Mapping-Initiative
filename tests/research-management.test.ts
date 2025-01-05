import { describe, it, expect } from 'vitest';

// Simulating the contract state
let proposals = new Map<number, { title: string, description: string, fundingRequested: number, researcher: string, status: string }>();
let fundingAllocations = new Map<number, { amount: number, recipient: string }>();
let nextProposalId = 0;

// Simulating contract functions
function submitProposal(title: string, description: string, fundingRequested: number, researcher: string): number {
  const id = nextProposalId++;
  proposals.set(id, { title, description, fundingRequested, researcher, status: 'pending' });
  return id;
}

function updateProposalStatus(id: number, newStatus: string): boolean {
  const proposal = proposals.get(id);
  if (!proposal) return false;
  proposal.status = newStatus;
  return true;
}

function allocateFunding(proposalId: number, amount: number): boolean {
  const proposal = proposals.get(proposalId);
  if (!proposal || proposal.status !== 'approved') return false;
  fundingAllocations.set(proposalId, { amount, recipient: proposal.researcher });
  return true;
}

describe('Research Management Contract', () => {
  it('should submit research proposals', () => {
    const proposalId = submitProposal('Quantum Entanglement Research', 'A study on long-distance quantum entanglement', 1000000, 'researcher1');
    expect(proposalId).toBe(0);
    expect(proposals.get(0)?.title).toBe('Quantum Entanglement Research');
    expect(proposals.get(0)?.status).toBe('pending');
  });
  
  it('should update proposal status', () => {
    const proposalId = submitProposal('Quantum Computing Algorithms', 'Developing new quantum algorithms', 2000000, 'researcher2');
    expect(updateProposalStatus(proposalId, 'approved')).toBe(true);
    expect(proposals.get(proposalId)?.status).toBe('approved');
  });
  
  it('should allocate funding to approved proposals', () => {
    const proposalId = submitProposal('Quantum Error Correction', 'Improving quantum error correction techniques', 1500000, 'researcher3');
    updateProposalStatus(proposalId, 'approved');
    expect(allocateFunding(proposalId, 1500000)).toBe(true);
    expect(fundingAllocations.get(proposalId)?.amount).toBe(1500000);
    expect(fundingAllocations.get(proposalId)?.recipient).toBe('researcher3');
  });
  
  it('should not allocate funding to non-approved proposals', () => {
    const proposalId = submitProposal('Quantum Cryptography', 'Enhancing quantum cryptography protocols', 1000000, 'researcher4');
    expect(allocateFunding(proposalId, 1000000)).toBe(false);
    expect(fundingAllocations.has(proposalId)).toBe(false);
  });
});

