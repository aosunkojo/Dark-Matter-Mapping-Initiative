import { describe, it, expect } from 'vitest';

// Simulating the contract state
let discoveries = new Map<number, { name: string, description: string, owner: string }>();
let nextDiscoveryId = 0;

// Simulating contract functions
function mintDiscovery(name: string, description: string, owner: string): number {
  const id = nextDiscoveryId++;
  discoveries.set(id, { name, description, owner });
  return id;
}

function transferDiscovery(id: number, from: string, to: string): boolean {
  const discovery = discoveries.get(id);
  if (!discovery || discovery.owner !== from) return false;
  discovery.owner = to;
  return true;
}

describe('Quantum Discovery NFT Contract', () => {
  it('should mint quantum discovery NFTs', () => {
    const discoveryId = mintDiscovery('Quantum Entanglement', 'A groundbreaking discovery', 'researcher1');
    expect(discoveryId).toBe(0);
    expect(discoveries.get(0)?.name).toBe('Quantum Entanglement');
    expect(discoveries.get(0)?.owner).toBe('researcher1');
  });
  
  it('should transfer quantum discovery NFTs', () => {
    const discoveryId = mintDiscovery('Quantum Teleportation', 'Another amazing discovery', 'researcher2');
    expect(transferDiscovery(discoveryId, 'researcher2', 'researcher3')).toBe(true);
    expect(discoveries.get(discoveryId)?.owner).toBe('researcher3');
  });
  
  it('should not transfer NFTs from non-owners', () => {
    const discoveryId = mintDiscovery('Quantum Superposition', 'Yet another discovery', 'researcher4');
    expect(transferDiscovery(discoveryId, 'researcher5', 'researcher6')).toBe(false);
    expect(discoveries.get(discoveryId)?.owner).toBe('researcher4');
  });
});

