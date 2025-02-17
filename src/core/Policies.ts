export type TableName =
  | 'bodies'
  | 'documents'
  | 'contexts'
  | 'layers'
  | 'projects'
  | 'project_documents'
  | 'targets';

export type OperationType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

export type Policies = {
  get(t: TableName): { has: (operation: OperationType) => boolean };
};

interface Policy {

  user_id: string; 

  table_name: string;

  operation: string;
  
}

export const parsePolicies = (policies: Policy[]): Policies => {
  // Index policies by table
  const byTable = new Map<string, Policy[]>();

  policies.forEach(p => {
    const existing = byTable.get(p.table_name);
    if (existing) {
      byTable.set(p.table_name, [...existing, p]);
    } else {
      byTable.set(p.table_name, [p]);
    }
  });

  const get = (t: TableName) => {
    const tablePolicies = byTable.get(t);

    return tablePolicies ? ({
      has: (operation: OperationType) =>
        tablePolicies.some(p => p.operation === operation)
    }) : ({
      has: () => false
    });
  }

  return { get };
}