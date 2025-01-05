import { describe, it, expect } from 'vitest';

// Simulating the contract state
let quantumComputers = new Map<number, { name: string, description: string, qubits: number }>();
let simulationJobs = new Map<number, { computerId: number, description: string, status: string, result: string | null }>();
let nextComputerId = 0;
let nextJobId = 0;

// Simulating contract functions
function registerQuantumComputer(name: string, description: string, qubits: number): number {
  const id = nextComputerId++;
  quantumComputers.set(id, { name, description, qubits });
  return id;
}

function submitSimulationJob(computerId: number, description: string): number {
  if (!quantumComputers.has(computerId)) throw new Error('Computer not found');
  const id = nextJobId++;
  simulationJobs.set(id, { computerId, description, status: 'pending', result: null });
  return id;
}

function updateJobStatus(jobId: number, status: string): boolean {
  const job = simulationJobs.get(jobId);
  if (!job) return false;
  job.status = status;
  return true;
}

describe('Quantum Computing Integration Contract', () => {
  it('should register quantum computers', () => {
    const computerId = registerQuantumComputer('Quantum Computer 1', 'A powerful quantum computer', 50);
    expect(computerId).toBe(0);
    expect(quantumComputers.get(0)?.name).toBe('Quantum Computer 1');
    expect(quantumComputers.get(0)?.qubits).toBe(50);
  });
  
  it('should submit simulation jobs', () => {
    const computerId = registerQuantumComputer('Quantum Computer 2', 'Another quantum computer', 100);
    const jobId = submitSimulationJob(computerId, 'Test Simulation');
    expect(jobId).toBe(0);
    expect(simulationJobs.get(0)?.description).toBe('Test Simulation');
    expect(simulationJobs.get(0)?.status).toBe('pending');
  });
  
  it('should update job status', () => {
    const computerId = registerQuantumComputer('Quantum Computer 3', 'Yet another quantum computer', 75);
    const jobId = submitSimulationJob(computerId, 'Status Update Simulation');
    expect(updateJobStatus(jobId, 'running')).toBe(true);
    expect(simulationJobs.get(jobId)?.status).toBe('running');
  });
});

