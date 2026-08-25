export type CopilotResponseMode = 'default' | 'headlines' | 'coaching';

export type CopilotResponseLength = 'short' | 'medium' | 'long';

export type CopilotMode = 'interview' | 'coding' | 'meeting';

export type CopilotSetup = {
  readonly mode: CopilotMode;
  readonly uploadedFileName: string;
  readonly interviewType: string;
  readonly difficulty: string;
  readonly targetRole: string;
  readonly companyName: string;
  readonly additionalContext: string;
  readonly responseMode: CopilotResponseMode;
  readonly responseLength: CopilotResponseLength;
  readonly meetingTitle?: string;
  readonly meetingAgenda?: string;
  readonly codingLanguage?: string;
};

export type CopilotPermissionStep = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'available' | 'complete' | 'disabled';
  readonly actionLabel: string;
};

export type CopilotLiveSession = {
  readonly mode: CopilotMode;
  readonly title: string;
  readonly timer: string;
  readonly signalLabel: string;
  readonly activityLabel: string;
  readonly screenPreviewSrc: string;
  readonly prompts: readonly string[];
};

export type CopilotTranscriptInterjection = {
  readonly speaker: string;
  readonly text: string;
};

export type CopilotTranscriptTurn = {
  readonly speaker: string;
  readonly question: string;
  readonly answer: string;
  readonly interjection?: CopilotTranscriptInterjection;
};

export type CopilotCodingTurn = {
  readonly question: string;
  readonly answer: string;
};

export type CopilotHistoryRow = {
  readonly id: string;
  readonly mode: CopilotMode;
  readonly title: string;
  readonly where: string;
  readonly company: string;
  readonly duration: string;
  readonly dateTime: string;
};

export type CopilotRubricStatus = 'strong' | 'partial' | 'needs-work';

export type CopilotRubricRow = {
  readonly element: string;
  readonly status: CopilotRubricStatus;
  readonly notes: string;
};

export type CopilotTalkTime = {
  readonly userPercent: number;
  readonly otherPercent: number;
  readonly otherLabel: string;
  readonly tip: string;
};

export type CopilotReport = {
  readonly title: string;
  readonly subtitle: string;
  readonly score: number;
  readonly summary: string;
  readonly whatWentWell: readonly string[];
  readonly whatNeedsWork: readonly string[];
  readonly knowledgeGaps: readonly string[];
  readonly suggestedQuestions: readonly string[];
  readonly rubric: readonly CopilotRubricRow[];
  readonly talkTime: CopilotTalkTime;
  readonly transcript: readonly { readonly id: string; readonly speaker: string; readonly isUser: boolean; readonly timestamp: string; readonly text: string }[];
};
