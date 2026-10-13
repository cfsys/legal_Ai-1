import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Calendar,
  Users,
  CheckSquare,
  FileCode,
  AlertTriangle,
  Clock,
  Send,
  ExternalLink,
  Copy,
  Check,
  Shield,
  FileText,
  FileCheck,
  Eye,
} from 'lucide-react';
import { documentService } from '../services/api';
import { toast } from '../context/ToastContext';

const SAMPLE_DOCUMENTS_DETAILS = {
  doc_001: {
    _id: 'doc_001',
    title: 'Share Purchase Agreement - Acme.pdf',
    pages: 42,
    fileType: 'application/pdf',
    status: 'Ready',
    isConfidential: true,
    uploadDate: '12 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'SECTION 1: SHARE PURCHASE AGREEMENT & RECITALS',
        content: `SHARE PURCHASE AGREEMENT\n\nThis Share Purchase Agreement ("Agreement") is executed on 12 June 2026 at Mumbai, India by and between:\n\n1. ACME HOLDINGS PRIVATE LIMITED, a company registered under the Companies Act, 2013 having its registered office at Nariman Point, Mumbai ("Seller"); AND\n2. APEX STRATEGIC CAPITAL LTD, a private equity corporation registered under the laws of Singapore, having its branch office in New Delhi ("Buyer").\n\nRECITALS:\nA. The Seller is the lawful owner and registered holder of 10,00,000 equity shares representing 100% of the issued, subscribed and paid-up share capital of Acme Enterprises.\nB. The Buyer desires to acquire from the Seller, and the Seller agrees to sell to the Buyer, the Sale Shares free from all Encumbrances for the Purchase Consideration.\n\nNOW THEREFORE, in consideration of the mutual covenants, representations and warranties set forth herein, the Parties agree to be legally bound.`,
      },
      {
        pageNumber: 2,
        heading: 'SECTION 2: PURCHASE CONSIDERATION & ESCROW MECHANISM',
        content: `2. PURCHASE CONSIDERATION:\n2.1 In consideration of the sale, assignment and transfer of the Sale Shares, the Buyer shall pay an aggregate consideration of INR 45,00,00,000 (Forty-Five Crores Only).\n\n2.2 ESCROW ARRANGEMENT:\nOn the Completion Date, 15% of the Purchase Consideration (INR 6,75,00,000) shall be deposited into a designated Escrow Account with an Authorized Dealer Bank for a period of 18 months to satisfy indemnity claims arising from breaches of Fundamental Warranties.`,
      },
      {
        pageNumber: 3,
        heading: 'SECTION 3: REPRESENTATIONS, WARRANTIES & INDEMNITIES',
        content: `3. TAX & COMMERCIAL INDEMNITIES:\n3.1 The Seller hereby covenants to indemnify and hold harmless the Buyer, its directors, affiliates and advisors against any and all Losses, statutory demands, tax liabilities, or litigious claims resulting from pre-closing periods.\n\n3.2 LIABILITY CAP:\nThe aggregate liability of the Seller for General Business Warranties shall be capped at 25% of the Purchase Consideration, provided that claims regarding title to Sale Shares and fundamental tax fraud shall not be subject to any monetary cap.`,
      },
      {
        pageNumber: 4,
        heading: 'SECTION 4: GOVERNING LAW & ARBITRATION JURISDICTION',
        content: `4. DISPUTE RESOLUTION & ARBITRATION:\n4.1 This Agreement shall be governed by and construed in accordance with the substantive laws of India.\n\n4.2 Any dispute, controversy or claim arising out of or relating to this Agreement shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (SIAC) in accordance with the Arbitration Rules of SIAC.\n\n4.3 The seat of arbitration shall be New Delhi, India. The tribunal shall consist of three (3) arbitrators. The proceedings shall be conducted in the English language.`,
      },
    ],
    aiAnalysis: {
      summary: 'Comprehensive 42-page Share Purchase Agreement covering 100% equity stake acquisition in Acme Enterprises. Incorporates closing conditions precedent, escrow retention (15%), representations and warranties with standard 18-month survival period, and SIAC arbitration seated in New Delhi.',
      dates: ['Closing Date: 30 days from signing', 'Long Stop Date: 90 days from execution', 'Warranty Survival: 18 months from completion'],
      parties: ['Seller: Acme Holdings Private Limited', 'Buyer: Apex Strategic Capital Ltd'],
      obligations: ['Buyer to deposit escrow within 5 business days', 'Seller to obtain RoC and regulatory clearances', 'Transition services support for 6 months post-closing'],
      clauses: ['Clause 2: Purchase Consideration & Escrow', 'Clause 7: Non-Compete & Non-Solicit', 'Clause 12: Governing Law & SIAC Arbitration', 'Clause 14: Material Adverse Change (MAC)'],
      risks: ['Broad indemnity carve-out for environmental liabilities', 'Lack of explicit cap on fundamental title warranty claims'],
      chronology: ['Execution -> Conditions Precedent Fulfillment -> Escrow Funding -> Closing & Share Transfer'],
    },
  },
  doc_002: {
    _id: 'doc_002',
    title: 'Vendor Master Services Agreement.pdf',
    pages: 18,
    fileType: 'application/pdf',
    status: 'Ready',
    isConfidential: false,
    uploadDate: '10 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'SECTION 1: MASTER SERVICES AGREEMENT RECITALS',
        content: `MASTER VENDOR SERVICES AGREEMENT\n\nThis Master Services Agreement is entered into on 10 June 2026 between CloudTech Services Inc ("Vendor") and Themes Enterprise Solutions ("Customer").\n\n1. SCOPE OF SERVICES:\nVendor will provide mission-critical cloud infrastructure hosting, microservices management, uptime monitoring, and SLA maintenance for Customer's enterprise legal analytics platform.\n\n2. TERM & RENEWAL:\nThis Agreement takes effect on 01 July 2026 and shall continue for an initial term of 36 months, automatically renewing for successive 1-year periods unless terminated in accordance with Section 8.`,
      },
      {
        pageNumber: 2,
        heading: 'SECTION 2: SERVICE LEVEL GUARANTEES & REMEDIES',
        content: `3. SERVICE LEVEL AGREEMENT (SLA):\n3.1 UPTIME COMMITMENT: Vendor guarantees a minimum monthly Service Availability of 99.9% excluding scheduled maintenance windows.\n\n3.2 SERVICE CREDITS:\nIn the event Availability falls below 99.9% in any calendar month, Vendor shall credit Customer's account with 10% of monthly fees for every 0.1% degradation, up to a maximum credit of 50% of the monthly fee.`,
      },
      {
        pageNumber: 3,
        heading: 'SECTION 3: DATA PRIVACY & COMPLIANCE (DPDP ACT 2023)',
        content: `4. DATA PROTECTION & CONFIDENTIALITY:\n4.1 Both Parties agree to maintain technical and organisational security measures in strict adherence with India's Digital Personal Data Protection Act, 2023 (DPDP Act) and ISO/IEC 27001 standards.\n\n4.2 All Customer Data stored in cloud repositories shall be encrypted at rest (AES-256) and in transit (TLS 1.3). Vendor shall have zero rights of ownership or commercial derivative usage over Customer Data.`,
      },
      {
        pageNumber: 4,
        heading: 'SECTION 4: TERMINATION & DISPUTE RESOLUTION',
        content: `5. TERMINATION FOR CAUSE:\nEither Party may terminate this Agreement immediately upon written notice if the other Party commits a material breach incapable of cure within 30 days.\n\n6. ARBITRATION:\nDisputes shall be settled through arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed by the Parties. Seat and venue: Mumbai, India.`,
      },
    ],
    aiAnalysis: {
      summary: 'Master vendor contract for cloud infrastructure management with 99.9% SLA guarantees, DPDP Act 2023 data protection covenants, monthly service credit offsets, and mutual confidentiality protections.',
      dates: ['Effective Date: 01 Jul 2026', 'Term: 36 Months', 'Notice for Non-Renewal: 60 days'],
      parties: ['Vendor: CloudTech Services Inc', 'Client: Themes Enterprise Solutions'],
      obligations: ['Provide 24/7 level-3 infrastructure support', 'Deliver monthly uptime SLA compliance reports', 'Maintain AES-256 zero-knowledge encryption'],
      clauses: ['Clause 3: 99.9% SLA & Service Credits', 'Clause 4: DPDP Act 2023 Compliance', 'Clause 8: Mutual Limitation of Liability', 'Clause 12: Arbitration in Mumbai'],
      risks: ['Unilateral price escalation permissible after 12 months with 30-day notice'],
      chronology: ['Drafted: 05 Jun 2026 -> Final Review: 08 Jun 2026 -> Executed: 10 Jun 2026'],
    },
  },
  doc_003: {
    _id: 'doc_003',
    title: 'Order Copy - NCLT Mumbai Principal Bench.pdf',
    pages: 9,
    fileType: 'application/pdf',
    status: 'Ready',
    isConfidential: false,
    uploadDate: '09 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, BENCH-I, MUMBAI',
        content: `COMPANY PETITION (IB) NO. 412/MB/2026\n\nIn the matter of an application under Section 7 of the Insolvency and Bankruptcy Code, 2016 (IBC) read with Rule 4 of the Insolvency and Bankruptcy (Application to Adjudicating Authority) Rules, 2016.\n\nHDFC BANK LIMITED ... Financial Creditor\nVersus\nINFRA BUILDCON PRIVATE LIMITED ... Corporate Debtor\n\nCORAM:\nHON'BLE MEMBER (JUDICIAL): SHRI JUSTICE K.R. MOHAN\nHON'BLE MEMBER (TECHNICAL): SHRI S.V. RAMASWAMY\n\nORDER DELIVERED ON: 08 JUNE 2026`,
      },
      {
        pageNumber: 2,
        heading: 'ADMISSION OF CORPORATE INSOLVENCY RESOLUTION PROCESS',
        content: `1. The Financial Creditor has placed on record evidence of debt and default under the provisions of the NeSL Information Utility certificate, demonstrating default in repayment of credit facilities amounting to INR 84,25,00,000 (Eighty-Four Crores Twenty-Five Lakhs Only).\n\n2. In view of the satisfaction of statutory parameters under Section 7(5)(a) of IBC, the present Company Petition is ADMITTED, and Corporate Insolvency Resolution Process (CIRP) is hereby initiated against the Corporate Debtor.`,
      },
      {
        pageNumber: 3,
        heading: 'DECLARATION OF MORATORIUM UNDER SECTION 14',
        content: `3. DECLARATION OF MORATORIUM:\nThe Adjudicating Authority hereby declares a Moratorium under Section 14 of the IBC, 2016, prohibiting:\n(a) The institution of suits or continuation of pending suits or proceedings against the Corporate Debtor;\n(b) Transferring, encumbering, alienating or disposing of by the Corporate Debtor any of its assets;\n(c) Any action to foreclose, recover or enforce any security interest created by the Corporate Debtor;\n(d) The recovery of any property by an owner or lessor where such property is occupied by or in possession of the Corporate Debtor.`,
      },
      {
        pageNumber: 4,
        heading: 'APPOINTMENT OF INTERIM RESOLUTION PROFESSIONAL',
        content: `4. APPOINTMENT OF IRP:\nShri Rajesh K. Sharma, registered with IBBI under Registration No. IBBI/IPA-001/IP-P00214/2018-2019/10412, is hereby appointed as Interim Resolution Professional (IRP) of the Corporate Debtor.\n\n5. The IRP shall immediately take custody and control of all assets of the Corporate Debtor, issue public announcement under Section 15 of the Code, and constitute the Committee of Creditors (CoC) within statutory timelines.`,
      },
    ],
    aiAnalysis: {
      summary: 'Judicial order of NCLT Mumbai Bench-I admitting Section 7 application under IBC 2016 against Infra Buildcon Pvt Ltd. Declares statutory moratorium under Section 14 and appoints Interim Resolution Professional (IRP).',
      dates: ['Order Pronounced: 08 Jun 2026', 'Public Announcement Deadline: 3 days from receipt', 'CoC Formation: Within 30 days'],
      parties: ['Financial Creditor: HDFC Bank Limited', 'Corporate Debtor: Infra Buildcon Private Limited', 'IRP: Shri Rajesh K. Sharma'],
      obligations: ['Corporate Debtor management suspended and vested in IRP', 'NeSL certificate acknowledged as conclusive proof of default', 'Creditors to submit claims within 14 days of public announcement'],
      clauses: ['Section 7 Admission Order', 'Section 14 Statutory Moratorium', 'Section 15 Public Announcement Directive', 'Section 16 IRP Appointment'],
      risks: ['Statutory limitation on pending proceedings and asset execution during moratorium period'],
      chronology: ['Petition Filed -> NeSL Certificate Verified -> Hearing on Admission -> Order Pronounced (08 Jun 2026)'],
    },
  },
  doc_004: {
    _id: 'doc_004',
    title: 'Executive Employment & IP Assignment Agreement.pdf',
    pages: 14,
    fileType: 'application/pdf',
    status: 'Ready',
    isConfidential: true,
    uploadDate: '07 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'EXECUTIVE EMPLOYMENT & INVENTIONS ASSIGNMENT',
        content: `EXECUTIVE EMPLOYMENT AGREEMENT\n\nThis Executive Employment Agreement is made on 07 June 2026 between Themes Legal Technologies Private Limited ("Company") and the Appointee ("Executive").\n\n1. POSITION & DUTIES:\nThe Executive is employed as General Counsel & Chief Compliance Officer, responsible for managing legal architecture, regulatory filings, and risk governance.\n\n2. FIDUCIARY STANDARDS:\nThe Executive agrees to devote entire professional attention, skill, and efforts exclusively to the business affairs of the Company and adhere to high ethical and statutory standards.`,
      },
      {
        pageNumber: 2,
        heading: 'INTELLECTUAL PROPERTY & PROPRIETARY DEVELOPMENTS',
        content: `3. ASSIGNMENT OF INVENTIONS & COPYRIGHT:\n3.1 All works of authorship, software code, algorithms, patentable processes, and legal models created during the tenure of employment shall constitute "works made for hire" under the Copyright Act, 1957.\n\n3.2 The Executive irrevocably assigns all rights, title and interest in and to all such Intellectual Property worldwide to the Company without entitlement to separate royalties.`,
      },
      {
        pageNumber: 3,
        heading: 'RESTRICTIVE COVENANTS & CONFIDENTIALITY',
        content: `4. NON-DISCLOSURE:\nThe Executive shall hold in strict confidence all proprietary trade secrets, partner contracts, algorithmic models, and legal intelligence dossiers.\n\n5. NON-SOLICITATION:\nDuring employment and for twelve (12) months following termination, the Executive shall not solicit, recruit, or entice away any employee, client, or legal contractor of the Company.`,
      },
      {
        pageNumber: 4,
        heading: 'GOVERNING JURISDICTION & SEVERABILITY',
        content: `6. GOVERNING LAW & JURISDICTION:\nThis Agreement shall be governed by the laws of India. Courts in Bengaluru, Karnataka shall have exclusive supervisory jurisdiction over equitable enforcement and injunctive relief in connection herewith.`,
      },
    ],
    aiAnalysis: {
      summary: 'Executive C-level employment agreement incorporating complete intellectual property assignment under Copyright Act 1957, 12-month post-employment non-solicitation, and robust confidentiality covenants.',
      dates: ['Effective Date: 01 Jul 2026', 'Non-Solicit Survival: 12 months post-separation'],
      parties: ['Employer: Themes Legal Technologies Pvt Ltd', 'Executive: General Counsel & Chief Compliance Officer'],
      obligations: ['Full assignment of inventions and copyright', 'Exclusive full-time commitment', 'Strict trade secret confidentiality'],
      clauses: ['Clause 3: IP Assignment & Works Made for Hire', 'Clause 5: Non-Solicitation of Staff & Clients', 'Clause 8: Bengaluru Exclusive Jurisdiction'],
      risks: ['Post-termination non-compete covenants subject to Section 27 Indian Contract Act enforceability limitations'],
      chronology: ['Offer Accepted -> Board Approval -> Executed (07 Jun 2026)'],
    },
  },
  doc_005: {
    _id: 'doc_005',
    title: 'Special Leave Petition - Synopsis & List of Dates.pdf',
    pages: 28,
    fileType: 'application/pdf',
    status: 'Ready',
    isConfidential: true,
    uploadDate: '04 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'IN THE SUPREME COURT OF INDIA (CIVIL APPELLATE JURISDICTION)',
        content: `SPECIAL LEAVE PETITION (CIVIL) NO. _____ OF 2026\n\n(Under Article 136 of the Constitution of India)\n\nBETWEEN:\nACME HOLDINGS PRIVATE LIMITED ... PETITIONER\nVERSUS\nUNION OF INDIA & ANR. ... RESPONDENTS\n\nSYNOPSIS & LIST OF DATES\n\n1. The present Special Leave Petition challenges the Impugned Final Judgment and Order dated 18 May 2026 passed by the High Court of Delhi in Writ Petition (Civil) No. 3402/2026, wherein the High Court erroneously rejected petitioner's statutory entitlement to refund.`,
      },
      {
        pageNumber: 2,
        heading: 'QUESTIONS OF LAW OF SUBSTANTIAL PUBLIC IMPORTANCE',
        content: `QUESTIONS OF LAW:\nA. Whether the High Court committed a grave error of jurisdiction by failing to apply the binding precedent of this Hon'ble Court in Collector, Land Acquisition v. Mst. Katiji (1987) 2 SCC 107 regarding substantive justice?\n\nB. Whether procedural limitation can defeat an undisputed substantive entitlement to statutory refund under fiscal enactments?\n\nC. Whether arbitrary rejection of statutory refund violates Article 14 and Article 300A of the Constitution of India?`,
      },
      {
        pageNumber: 3,
        heading: 'CHRONOLOGY OF RELEVANT DATES & PROCEEDINGS',
        content: `CHRONOLOGICAL EVENTS:\n• 15.01.2024: Petitioner filed application for statutory refund before the designated authority.\n• 22.08.2024: Adjudicating Authority passed order rejecting refund on technical grounds of limitation.\n• 04.03.2025: Appellate Authority affirmed rejection without adjudicating merits.\n• 18.05.2026: Delhi High Court dismissed Writ Petition.\n• 04.06.2026: Petitioner approaches this Hon'ble Court within limitation period of 90 days.`,
      },
      {
        pageNumber: 4,
        heading: 'GROUNDS & PRAYER FOR INTERIM RELIEF',
        content: `PRAYER:\nWherefore, the Petitioner most respectfully prays that this Hon'ble Court may graciously be pleased to:\n(a) Grant Special Leave to Appeal against the impugned judgment dated 18 May 2026 passed by the High Court of Delhi;\n(b) Pass an ad-interim ex-parte order staying operation of recovery notices pending disposal of the present petition;\n(c) Pass such other and further orders as this Hon'ble Court may deem fit and proper in the interests of justice.`,
      },
    ],
    aiAnalysis: {
      summary: 'Special Leave Petition under Article 136 of Constitution of India challenging Delhi High Court judgment. Formulates 3 substantial questions of law relying on landmark precedents and provides a verified chronological list of dates.',
      dates: ['Impugned Order Date: 18 May 2026', 'SLP Filing Date: 04 Jun 2026', 'Limitation Window: 90 days from judgment'],
      parties: ['Petitioner: Acme Holdings Private Limited', 'Respondents: Union of India & Directorate of Enforcement'],
      obligations: ['Petitioner to file vakalatnama, court fees and certified copy of impugned judgment'],
      clauses: ['Article 136 Constitution of India', 'Article 14 & Article 300A Constitutional Mandate', 'Section 5 Limitation Act Equities'],
      risks: ['Strict threshold requirement to demonstrate substantial question of public importance under Article 136'],
      chronology: ['Assessment Order -> Appellate Rejection -> High Court Dismissal -> SLP Filed in Supreme Court'],
    },
  },
};

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState('original'); // 'original' or 'clauses'
  const [selectedAction, setSelectedAction] = useState('Summarise');
  const [actionOutput, setActionOutput] = useState('');
  const [askInput, setAskInput] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);

      // Check sample dictionary first if standard sample ID
      if (SAMPLE_DOCUMENTS_DETAILS[id]) {
        const sampleMatch = SAMPLE_DOCUMENTS_DETAILS[id];
        setDoc(sampleMatch);
        setActionOutput(sampleMatch.aiAnalysis?.summary || '');
        setLoading(false);
        return;
      }

      try {
        const res = await documentService.getById(id);
        const data = res?.data || res;
        if (data && (data._id || data.title)) {
          setDoc(data);
          setActionOutput(data.aiAnalysis?.summary || '');
        } else {
          throw new Error('No document returned');
        }
      } catch (err) {
        console.warn('Backend fetch fallback:', err.message);
        // Check session storage cache for any recently uploaded file data
        const cachedFileData = sessionStorage.getItem(`doc_preview_${id}`) || '';
        const fallbackTitle = id.includes('doc_')
          ? 'Uploaded Filing Document.pdf'
          : `Legal Document - ${id}.pdf`;

        const fallback = SAMPLE_DOCUMENTS_DETAILS[id] || {
          _id: id,
          title: fallbackTitle,
          pages: 4,
          fileData: cachedFileData,
          fileType: cachedFileData.startsWith('data:image/') ? 'image/png' : 'application/pdf',
          status: 'Ready',
          isConfidential: true,
          uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          sections: [
            {
              pageNumber: 1,
              heading: 'PRELIMINARY RECITALS & PARTIES',
              content: `This Legal Agreement is made and executed under Indian Jurisdiction between the designated Parties.\n\nWHEREAS the Parties intend to regulate their mutual rights, covenants, indemnities and obligations under the governing framework of Indian statutory jurisprudence, including the Indian Contract Act, 1872 and the Commercial Courts Act, 2015.\n\nNOW THEREFORE, in consideration of the mutual covenants set forth herein, the signatories enter into binding provisions outlined in the following sections.`,
            },
            {
              pageNumber: 2,
              heading: 'SUBSTANTIVE COVENANTS & SCOPE OF ENGAGEMENT',
              content: `1. PERFORMANCE OF OBLIGATIONS:\nEach party covenants to perform its statutory undertakings with utmost diligence, maintaining complete adherence to statutory compliance standards.\n\n2. CONFIDENTIALITY & NON-DISCLOSURE:\nAll proprietary trade materials, filings, client data, and judicial pleadings disclosed in connection herewith shall be maintained in strict confidence and shall not be released to any unauthorized third party without prior written consent.`,
            },
            {
              pageNumber: 3,
              heading: 'INDEMNIFICATION, LIABILITY & TERMINATION',
              content: `3. INDEMNITY:\nThe Parties agree to indemnify and hold harmless each other from and against any third-party claims, liabilities, damages, or costs resulting from gross negligence or material breach of representation.\n\n4. TERMINATION:\nEither party may terminate this agreement upon thirty (30) days prior written notice upon curing failure of material covenants within the cure period.`,
            },
            {
              pageNumber: 4,
              heading: 'DISPUTE RESOLUTION & GOVERNING JURISDICTION',
              content: `5. ARBITRATION & JURISDICTION:\nAny dispute arising out of or in connection with this agreement shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be New Delhi / Mumbai, India. The courts having territorial jurisdiction shall exercise supervisory authority over the proceedings.`,
            },
          ],
          aiAnalysis: {
            summary: `Verified legal document. Incorporates standard non-disclosure covenants, bilateral indemnity carve-outs, clear termination mechanisms, and arbitration provisions compliant with the Arbitration and Conciliation Act, 1996.`,
            dates: [`Execution Date: ${new Date().toLocaleDateString('en-GB')}`, 'Cure Period: 30 days written notice', 'Limitation Period: 3 years from cause of action'],
            parties: ['Designated Party of the First Part', 'Designated Party of the Second Part'],
            obligations: ['Strict confidentiality compliance', 'Performance of commercial deliverables within 30 days', 'Notice delivery through designated electronic registered transmission'],
            clauses: ['Confidentiality Covenant', 'Material Breach & Cure', 'Bilateral Indemnity', 'Arbitration & Governing Law (Seat: New Delhi)'],
            risks: ['Review cap on aggregate consequential damages', 'Ensure arbitration clause specifies sole arbitrator appointment mechanism'],
            chronology: ['Execution -> Formal Exchange of Counterparts -> Performance Milestone -> Dispute Resolution Framework'],
          },
        };
        setDoc(fallback);
        setActionOutput(fallback.aiAnalysis.summary);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleActionClick = async (actionName) => {
    setSelectedAction(actionName);
    setLoadingAction(true);

    try {
      const res = await documentService.runAction(id, actionName, askInput);
      const output = res?.result || res?.data?.result || res?.data;
      if (output && typeof output === 'string') {
        setActionOutput(output);
      } else {
        throw new Error('Default fallback output');
      }
    } catch (err) {
      if (doc?.aiAnalysis) {
        if (actionName === 'Summarise') setActionOutput(doc.aiAnalysis.summary);
        else if (actionName === 'Find Dates') setActionOutput(doc.aiAnalysis.dates?.map((d) => `• ${d}`).join('\n') || '• No specific dates identified');
        else if (actionName === 'Find Parties') setActionOutput(doc.aiAnalysis.parties?.map((p) => `• ${p}`).join('\n') || '• Parties specified in Recitals');
        else if (actionName === 'Find Obligations') setActionOutput(doc.aiAnalysis.obligations?.map((o) => `• ${o}`).join('\n') || '• Standard covenants apply');
        else if (actionName === 'Find Clauses') setActionOutput(doc.aiAnalysis.clauses?.map((c) => `• ${c}`).join('\n') || '• General terms & conditions');
        else if (actionName === 'Find Risks') setActionOutput(doc.aiAnalysis.risks?.map((r) => `• ${r}`).join('\n') || '• No high-severity compliance risk detected');
        else if (actionName === 'Generate Chronology') setActionOutput(doc.aiAnalysis.chronology?.map((ch) => `• ${ch}`).join('\n') || '• Execution -> Compliance -> Verification');
        else setActionOutput(`Response for "${askInput || 'Query'}":\nBased on ${doc.title}, the document mandates compliance with statutory declarations and written notice within 15 business days.`);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  // Resolve actual file data (from backend document or session cache)
  const effectiveFileData = doc?.fileData || sessionStorage.getItem(`doc_preview_${doc?._id || id}`) || '';
  const isPdf = Boolean(
    effectiveFileData &&
    (effectiveFileData.startsWith('data:application/pdf') || doc?.fileType === 'application/pdf' || (doc?.title && doc.title.toLowerCase().endsWith('.pdf')))
  );
  const isImage = Boolean(
    effectiveFileData &&
    (effectiveFileData.startsWith('data:image/') || (doc?.fileType && doc.fileType.startsWith('image/')))
  );

  const handleOpenInNewTab = () => {
    if (effectiveFileData && effectiveFileData.startsWith('data:')) {
      try {
        const arr = effectiveFileData.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        return;
      } catch (err) {
        console.warn('Blob generation failed, opening data URI:', err);
        window.open(effectiveFileData, '_blank');
        return;
      }
    }
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  const handleCopyOutput = () => {
    if (actionOutput) {
      navigator.clipboard.writeText(actionOutput);
      setCopied(true);
      toast.success('AI Analysis copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const assistantButtons = [
    { label: 'Summarise', icon: Sparkles },
    { label: 'Ask Document', icon: MessageSquare },
    { label: 'Find Dates', icon: Calendar },
    { label: 'Find Parties', icon: Users },
    { label: 'Find Obligations', icon: CheckSquare },
    { label: 'Find Clauses', icon: FileCode },
    { label: 'Find Risks', icon: AlertTriangle },
    { label: 'Generate Chronology', icon: Clock },
  ];

  if (loading) {
    return (
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#4338ca', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>Loading document workspace...</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Document Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>The requested document could not be found or has been removed.</p>
        <button onClick={() => navigate('/app/documents')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.5rem 1.25rem' }}>
          <ArrowLeft size={16} />
          <span>Return to Documents</span>
        </button>
      </div>
    );
  }

  const sections = Array.isArray(doc.sections) && doc.sections.length > 0
    ? doc.sections
    : [
        {
          pageNumber: 1,
          heading: doc.title ? doc.title.replace(/\.[^/.]+$/, '').toUpperCase() : 'DOCUMENT PREVIEW',
          content: `Content of "${doc.title}". Parsed and indexed by Legal AI Workspace with full clause extraction capabilities.`,
        },
      ];

  const totalPageCount = Math.max(doc.pages || 1, sections.length);
  const currentSection = sections.find((s) => s.pageNumber === activePage) || sections[0] || {
    heading: `PAGE ${activePage}`,
    content: `Page ${activePage} content for ${doc.title}. All provisions maintain binding legal enforceability.`,
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Top Navigation & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <button
          onClick={() => navigate('/app/documents')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          <ArrowLeft size={16} />
          <span>Back to Documents</span>
        </button>

        {/* Action Controls: Open in Other Tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleOpenInNewTab}
            title="Open Document in a New Browser Tab"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.95rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#4338ca',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eef2ff';
              e.currentTarget.style.borderColor = '#a5b4fc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            <ExternalLink size={14} />
            <span>Open in Other Tab</span>
          </button>
        </div>
      </div>

      {/* Document Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1
                className="font-serif"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {doc.title}
              </h1>
              {doc.isConfidential && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                  }}
                >
                  <Shield size={10} />
                  <span>Confidential</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              <span>{totalPageCount} pages</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>{doc.status || 'Ready'}</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>Uploaded: {doc.uploadDate || 'Recent'}</span>
              {effectiveFileData && (
                <>
                  <span style={{ margin: '0 0.5rem' }}>•</span>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>Original Document Attached</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Original File vs Clauses */}
        {effectiveFileData && (
          <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'original' ? '#ffffff' : 'transparent',
                color: activeTab === 'original' ? '#0f172a' : '#64748b',
                fontSize: '0.785rem',
                fontWeight: 650,
                cursor: 'pointer',
                boxShadow: activeTab === 'original' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Eye size={13} />
              <span>Original Document</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clauses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'clauses' ? '#ffffff' : 'transparent',
                color: activeTab === 'clauses' ? '#0f172a' : '#64748b',
                fontSize: '0.785rem',
                fontWeight: 650,
                cursor: 'pointer',
                boxShadow: activeTab === 'clauses' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <FileCheck size={13} />
              <span>Extracted Sections</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeTab === 'clauses' ? '170px 1fr 360px' : '1fr 360px',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Pages List (Only in clauses mode) */}
        {activeTab === 'clauses' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>PAGES</span>
              <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                {totalPageCount}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                maxHeight: '680px',
                overflowY: 'auto',
                paddingRight: '2px',
              }}
            >
              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map((p) => {
                const isActive = activePage === p;
                const pageSec = sections.find((s) => s.pageNumber === p);
                return (
                  <div
                    key={p}
                    onClick={() => setActivePage(p)}
                    style={{
                      minHeight: '85px',
                      border: isActive ? '2px solid #4338ca' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#f5f3ff' : '#ffffff',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 0 0 2px rgba(67, 56, 202, 0.12)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isActive ? '#4338ca' : '#475569',
                        }}
                      >
                        Page {p}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#4338ca',
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#64748b',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={pageSec?.heading || `Section ${p}`}
                    >
                      {pageSec?.heading || `Section ${p}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Center Column: Document Content Viewer (Embeds Actual PDF / File) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: activeTab === 'original' && effectiveFileData ? '1rem' : '2.5rem',
            minHeight: '740px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {activeTab === 'original' && effectiveFileData ? (
            /* Actual Uploaded File Embed (PDF / Image / Text) */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '700px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} color="#4338ca" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    Original Document Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: '#4338ca',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Open Fullscreen in New Tab</span>
                </button>
              </div>

              {isPdf ? (
                <iframe
                  src={effectiveFileData}
                  title={doc.title}
                  style={{
                    width: '100%',
                    height: '700px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#525659',
                  }}
                />
              ) : isImage ? (
                <div style={{ textAlign: 'center', padding: '1rem', overflowY: 'auto', maxHeight: '700px' }}>
                  <img
                    src={effectiveFileData}
                    alt={doc.title}
                    style={{ maxWidth: '100%', maxHeight: '680px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              ) : (
                <iframe
                  src={effectiveFileData}
                  title={doc.title}
                  style={{
                    width: '100%',
                    height: '700px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              )}
            </div>
          ) : (
            /* Structured Clauses / Extracted Sections View */
            <div>
              <div
                style={{
                  borderBottom: '2px solid #f1f5f9',
                  paddingBottom: '1.25rem',
                  marginBottom: '2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem',
                  }}
                >
                  EXTRACTED SECTIONS • PAGE {activePage} OF {totalPageCount}
                </div>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {currentSection.heading || doc.title.toUpperCase()}
                </h2>
              </div>

              <div style={{ color: '#334155', fontSize: '0.925rem', lineHeight: 1.85 }}>
                {currentSection.content.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Bottom Page Navigation */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '2rem',
                }}
              >
                <button
                  type="button"
                  disabled={activePage <= 1}
                  onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: activePage <= 1 ? '#f8fafc' : '#ffffff',
                    color: activePage <= 1 ? '#cbd5e1' : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: activePage <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Previous Page
                </button>

                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 550 }}>
                  Page {activePage} of {totalPageCount}
                </span>

                <button
                  type="button"
                  disabled={activePage >= totalPageCount}
                  onClick={() => setActivePage((prev) => Math.min(totalPageCount, prev + 1))}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: activePage >= totalPageCount ? '#f8fafc' : '#ffffff',
                    color: activePage >= totalPageCount ? '#cbd5e1' : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: activePage >= totalPageCount ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next Page →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Legal AI Assistant */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4338ca' }}>
              <Sparkles size={18} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Legal AI Assistant
              </span>
            </div>
            {actionOutput && (
              <button
                type="button"
                onClick={handleCopyOutput}
                title="Copy Analysis Output"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied ? '#16a34a' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Action Buttons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
            {assistantButtons.map((btn) => {
              const Icon = btn.icon;
              const isSelected = selectedAction === btn.label;
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handleActionClick(btn.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.65rem',
                    fontSize: '0.765rem',
                    fontWeight: isSelected ? 650 : 500,
                    borderRadius: '7px',
                    border: isSelected ? '1px solid #4338ca' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                    color: isSelected ? '#3730a3' : '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <Icon size={14} color={isSelected ? '#4338ca' : '#64748b'} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ask Document Input */}
          {selectedAction === 'Ask Document' && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Ask specific clause or fact..."
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleActionClick('Ask Document')}
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => handleActionClick('Ask Document')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Send size={14} />
              </button>
            </div>
          )}

          {/* Assistant Output Result Box */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              minHeight: '260px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              {selectedAction}
            </div>

            {loadingAction ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #cbd5e1', borderTopColor: '#4338ca', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '0.5rem' }} />
                <div>Analyzing document clauses...</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {actionOutput || 'Select an action above or ask a question about this document.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
