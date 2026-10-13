const Research = require('../models/Research');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const logger = require('../utils/logger');


// Helper to generate legal memorandum responses
const generateLegalMemorandum = (question, jurisdiction, acts, depth) => {
  const isDelayQuestion = question.toLowerCase().includes('delay') || question.toLowerCase().includes('condonation');
  const isContractQuestion = question.toLowerCase().includes('contract') || question.toLowerCase().includes('clause');
  const isPromissoryQuestion = question.toLowerCase().includes('estoppel');

  let answerText = '';
  let authorities = [];

  if (isDelayQuestion) {
    answerText = `### 1. Statutory Framework
Section 5 of the Limitation Act, 1963 empowers the Court to admit any appeal or application after the prescribed period if the appellant or applicant satisfies the Court that they had **"sufficient cause"** for not preferring the appeal or making the application within such period.

---

### 2. Principles Governing "Sufficient Cause"
#### 2.1 What Constitutes Sufficient Cause
**Perumon Bhagvathy Devaswom v. Bhargavi Amma**
*(2008) 8 SCC 321*
The Supreme Court held that "sufficient cause" means a cause that is:
- Beyond the party's control,
- Not attributable to negligence or lack of bona fides, and
- Explained satisfactorily to the Court's conscience.

**State of Nagaland v. Lipok AO**
*(2005) 3 SCC 752*
The Court reiterated that the expression "sufficient cause" should receive a **liberal construction** whenever no negligence, inaction, or lack of bona fides is imputable to the party.

---

### 3. Cardinal Principles Laid Down by Supreme Court
In **Collector, Land Acquisition v. Mst. Katiji (1987) 2 SCC 107**, a landmark two-judge bench enunciated the following six pillars:
1. Ordinarily, a litigant does not stand to benefit by lodging an appeal late.
2. Refusing to condone delay can result in a meritorious matter being thrown out at the threshold.
3. "Every day's delay must be explained" does not mean a pedantic, unrealistic approach should be taken.
4. When substantial justice and technical considerations are pitted against each other, cause of substantial justice deserves to be preferred.
5. There is no presumption that delay is occasioned deliberately or on account of culpable negligence.
6. The State/Government is also entitled to condonation if the explanation is bona fide and bureaucratic red-tape is explained realistically.`;

    authorities = [
      {
        title: 'Collector, Land Acquisition v. Mst. Katiji',
        citation: '(1987) 2 SCC 107',
        status: 'Good Law',
        relevance: 'Locus classicus on liberal approach to Section 5 Limitation Act.',
      },
      {
        title: 'Perumon Bhagvathy Devaswom v. Bhargavi Amma',
        citation: '(2008) 8 SCC 321',
        status: 'Good Law',
        relevance: 'Delineates contours of sufficient cause and guidelines for abated appeals.',
      },
      {
        title: 'State of Nagaland v. Lipok AO',
        citation: '(2005) 3 SCC 752',
        status: 'Good Law',
        relevance: 'Pragmatic approach in government delays and institutional procedural friction.',
      },
    ];
  } else if (isPromissoryQuestion) {
    answerText = `### 1. Doctrine of Promissory Estoppel in India
The Doctrine of Promissory Estoppel is an equitable doctrine recognized by Indian courts to prevent injustice where one party has made an unequivocal promise which was intended to create legal relations or affect a legal relationship.

---

### 2. Foundational Jurisprudence
**Motilal Padampat Sugar Mills Co. Ltd. v. State of U.P. (1979) 2 SCC 409**
The Supreme Court held that promissory estoppel is not merely a rule of evidence (Section 115 Evidence Act) but can form the basis of an independent cause of action.

**Union of India v. Godfrey Philips India Ltd. (1985) 4 SCC 369**
The doctrine binds public authorities and the State, subject only to supervening public interest.`;

    authorities = [
      {
        title: 'Motilal Padampat Sugar Mills v. State of U.P.',
        citation: '(1979) 2 SCC 409',
        status: 'Good Law',
        relevance: 'Established promissory estoppel as a substantive cause of action against the State.',
      },
      {
        title: 'Union of India v. Godfrey Philips India Ltd.',
        citation: '(1985) 4 SCC 369',
        status: 'Good Law',
        relevance: 'Affirmed enforcement of executive representations against sudden policy reversal.',
      },
    ];
  } else {
    answerText = `### 1. Executive Summary & Legal Query Analysis
Regarding the query: **"${question}"**
Jurisdiction: **${jurisdiction || 'Supreme Court of India'}**
Applicable Enactments: **${acts || 'Indian Statutory Law & Constitutional Provisions'}**

---

### 2. Relevant Legal Principles & Precedents
1. **Statutory Interpretation**: The provisions must be read in their plain and natural meaning unless ambiguity leads to manifest absurdity.
2. **Harmonious Construction**: Where conflicting provisions arise, the court seeks to give effect to both without rendering either nugatory.
3. **Leading Precedent**: **Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225** mandates that constitutional supremacy and basic structure form the ultimate guiding rubric.

---

### 3. Concluding Advice
- Ensure comprehensive documentation and timeline of notices.
- Verify whether limitation or jurisdictional bar applies before filing.`;

    authorities = [
      {
        title: 'Kesavananda Bharati v. State of Kerala',
        citation: '(1973) 4 SCC 225',
        status: 'Good Law',
        relevance: 'Constitutional bedrock and judicial oversight doctrine.',
      },
      {
        title: 'Swiss Ribbons Pvt. Ltd. v. Union of India',
        citation: '(2019) 4 SCC 17',
        status: 'Good Law',
        relevance: 'Commercial legislation interpretation and economic stability.',
      },
    ];
  }

  return { memorandum: answerText, authorities };
};

// @desc    Get user's research history
// @route   GET /api/research
// @access  Private
const getResearch = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (getIsMongooseConnected()) {
      const items = await Research.find({ user: userId }).sort({ createdAt: -1 });
      logger.info('Research', `Retrieved ${items.length} research memos for user: ${req.user.email}`);
      return sendSuccess(res, items, 'Research history retrieved');
    } else {
      const items = memoryStore.researches.filter((r) => r.userId === userId.toString());
      logger.info('Research', `Retrieved ${items.length} memory-store research memos for user: ${req.user.email}`);
      return sendSuccess(res, items, 'Research history retrieved');
    }
  } catch (error) {
    logger.error('Research', 'Failed to retrieve research history', error);
    return sendError(res, error.message || APP_STRINGS.RESEARCH.FETCH_FAILED, 500, error);
  }
};

// @desc    Create new research session
// @route   POST /api/research
// @access  Private
const createResearch = async (req, res) => {
  try {
    const { question, jurisdiction, acts, depth } = req.body;
    const userId = req.user._id || req.user.id;

    if (!question) {
      logger.warn('Research', 'Research creation attempted without legal question');
      return sendError(res, APP_STRINGS.RESEARCH.QUESTION_REQUIRED, 400);
    }

    const { memorandum, authorities } = generateLegalMemorandum(
      question,
      jurisdiction || 'Supreme Court of India',
      acts,
      depth || 'Standard'
    );

    if (getIsMongooseConnected()) {
      const research = await Research.create({
        user: userId,
        question,
        jurisdiction: jurisdiction || 'Supreme Court of India',
        acts: acts || '',
        depth: depth || 'Standard',
        memorandum,
        authorities,
      });
      logger.info('Research', `Created research memorandum in MongoDB: "${question.slice(0, 60)}..." (${authorities.length} authorities cited) for user: ${req.user.email}`);
      return sendSuccess(res, research, APP_STRINGS.RESEARCH.CREATE_SUCCESS, 201);
    } else {
      const newResearch = {
        _id: `res_${Date.now()}`,
        userId: userId.toString(),
        question,
        jurisdiction: jurisdiction || 'Supreme Court of India',
        acts: acts || '',
        depth: depth || 'Standard',
        memorandum,
        authorities,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      memoryStore.researches.unshift(newResearch);
      logger.info('Research', `Created research memorandum in memory-store: "${question.slice(0, 60)}..." for user: ${req.user.email}`);
      return sendSuccess(res, newResearch, APP_STRINGS.RESEARCH.CREATE_SUCCESS, 201);
    }
  } catch (error) {
    logger.error('Research', 'Failed to create research session', error);
    return sendError(res, error.message || APP_STRINGS.RESEARCH.CREATE_FAILED, 500, error);
  }
};

// @desc    Ask Legal AI direct chat
// @route   POST /api/research/ask
// @access  Private
const askThemesAi = async (req, res) => {
  try {
    const { court, area, depth } = req.body;
    const question = req.body.question || req.body.query || req.body.prompt;

    if (!question) {
      logger.warn('Research/AI', 'AskThemesAI called without prompt/question');
      return sendError(res, APP_STRINGS.RESEARCH.QUESTION_PROMPT_REQUIRED, 400);
    }

    logger.info('Research/AI', `Processing legal reasoning query: "${question.slice(0, 80)}..." [Court: ${court || 'All'}, Depth: ${depth || 'Standard'}] for user: ${req.user?.email}`);

    const { memorandum, authorities } = generateLegalMemorandum(question, court, area, depth);

    logger.info('Research/AI', `Generated analysis (${memorandum.length} characters, ${authorities.length} authorities cited)`);

    return sendSuccess(
      res,
      {
        question,
        court: court || 'Any Court',
        depth: depth || 'Standard',
        answer: memorandum,
        authorities,
      },
      'AI legal analysis generated'
    );
  } catch (error) {
    logger.error('Research/AI', 'Error generating AI legal analysis', error);
    return sendError(res, error.message || APP_STRINGS.RESEARCH.AI_REASONING_ERROR, 500, error);
  }
};


// @desc    Get research memorandum by ID
// @route   GET /api/research/:id
// @access  Private
const getResearchById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const research = await Research.findOne({ _id: id, user: userId });
      if (!research) {
        return sendError(res, 'Research memorandum not found', 404);
      }
      return sendSuccess(res, research, 'Research memorandum retrieved');
    } else {
      const found = memoryStore.research.find((r) => r._id === id && r.userId === userId.toString());
      if (!found) {
        return sendError(res, 'Research memorandum not found', 404);
      }
      return sendSuccess(res, found, 'Research memorandum retrieved');
    }
  } catch (error) {
    logger.error('Research', 'Failed to retrieve research by id', error);
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getResearch,
  getResearchById,
  createResearch,
  askThemesAi,
};

