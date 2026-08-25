export type InterviewType = 'introductory' | 'behavioral' | 'technical' | 'case-study';

export type InterviewDifficulty = 'easy' | 'medium' | 'hard';

export type InterviewerVoice = {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly summary: string;
  readonly imageSrc: string;
  readonly selected: boolean;
  readonly audioSrc?: string;
};

export type InterviewPrepSession = {
  readonly id: string;
  readonly uploadedFileName: string;
  readonly interviewType: InterviewType;
  readonly difficulty: InterviewDifficulty;
  readonly targetRole: string;
  readonly companyName: string;
  readonly additionalContext: string;
  readonly optionalDocuments: readonly string[];
};

export type InterviewParticipant = {
  readonly name: string;
  readonly title: string;
  readonly label: string;
  readonly imageSrc: string;
};

export type InterviewQuestion = {
  readonly id: string;
  readonly text: string;
};

export type InterviewLiveSession = {
  readonly title: string;
  readonly timer: string;
  readonly signalLabel: string;
  readonly activityLabel: string;
  readonly interviewer: InterviewParticipant;
  readonly candidate: InterviewParticipant;
  readonly questions: readonly InterviewQuestion[];
};

export type InterviewReportStep = {
  readonly id: string;
  readonly label: string;
  readonly status: 'complete' | 'active' | 'pending';
};

export type InterviewHistoryRow = {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly score: number;
  readonly duration: string;
  readonly dateTime: string;
};

export type InterviewScoreMetric = {
  readonly id: string;
  readonly label: string;
  readonly score: number;
  readonly interviewerScore: number;
  readonly note: string;
};

export type InterviewTranscriptEntry = {
  readonly id: string;
  readonly speaker: 'Maya' | 'You';
  readonly timestamp: string;
  readonly text: string;
};

export type InterviewRubricStatus = 'strong' | 'partial' | 'needs-work';

export type InterviewRubricRow = {
  readonly element: string;
  readonly status: InterviewRubricStatus;
  readonly notes: string;
};

export type InterviewTalkTime = {
  readonly youPercent: number;
  readonly interviewerPercent: number;
  readonly tip: string;
};

export type InterviewReport = {
  readonly title: string;
  readonly subtitle: string;
  readonly interviewerImageSrc: string;
  readonly score: number;
  readonly summary: string;
  readonly whatWentWell: readonly string[];
  readonly whatNeedsWork: readonly string[];
  readonly knowledgeGaps: readonly string[];
  readonly suggestedQuestions: readonly string[];
  readonly rubric: readonly InterviewRubricRow[];
  readonly talkTime: InterviewTalkTime;
  readonly metrics: readonly InterviewScoreMetric[];
  readonly transcript: readonly InterviewTranscriptEntry[];
};
