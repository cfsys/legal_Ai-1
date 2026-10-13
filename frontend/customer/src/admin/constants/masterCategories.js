export const MASTER_DATA_CATEGORIES = [
  { id: 'Court', name: 'Court', desc: 'Supreme Court, High Courts, Tribunals (NCLT, ITAT, SAT)' },
  { id: 'Bench', name: 'Bench', desc: 'Division Benches, Constitution, Single Judge Benches' },
  { id: 'Judge', name: 'Judge', desc: "Hon'ble Justices, Chief Justices & Presiding Officers" },
  { id: 'Act', name: 'Act & Statutory Code', desc: 'Central Acts, State Legislation, Penal Codes' },
  { id: 'Section', name: 'Section', desc: 'Statutory Sections, Orders, Rules & Sub-clauses' },
  { id: 'Practice Area', name: 'Practice Area', desc: 'Corporate Law, Criminal, Civil, Arbitration, Tax' },
  { id: 'Case Type', name: 'Case Type', desc: 'SLP (Civil/Crl), Writ Petitions, Appeals, Suits' },
  { id: 'Document Type', name: 'Document Type', desc: 'Vakalatnama, Rejoinder, Petitions, Affidavits' },
  { id: 'Legal Template', name: 'Legal Template', desc: 'Standard Petitions, Commercial NDAs, Bail Applications' },
  { id: 'Clause', name: 'Clause', desc: 'Indemnity, Force Majeure, Confidentiality, Dispute Resolution' },
  { id: 'Opposing Party', name: 'Opposing Party', desc: 'Opposite Counsel & Contesting Parties' },
];

/**
 * Returns default categories object for Master Data permissions.
 * Defaults all categories to { read: false, create: false, edit: false, delete: false }
 * or initialized to a base preset.
 */
export const createDefaultCategoryPermissions = (basePreset = { read: false, create: false, edit: false, delete: false }) => {
  const result = {};
  MASTER_DATA_CATEGORIES.forEach((cat) => {
    result[cat.id] = {
      read: Boolean(basePreset.read),
      create: Boolean(basePreset.create),
      edit: Boolean(basePreset.edit),
      delete: Boolean(basePreset.delete),
    };
  });
  return result;
};
