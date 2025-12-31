
export interface DorkResult {
  query: string;
  explanation: string;
  category: 'Configuration' | 'Documents' | 'Database' | 'Sensitive Info' | 'Login Pages' | 'General';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface GenerationState {
  loading: boolean;
  results: DorkResult[];
  error: string | null;
}
