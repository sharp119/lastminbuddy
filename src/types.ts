export enum Frequency {
  VERY_HIGH = 'Very High',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface QuestionVariant {
  paper: string;
  text: string;
  marks?: string;
  co?: string;
}

export interface TopicGroup {
  id: string;
  title: string;
  unit: number;
  description: string;
  frequency: Frequency;
  count: number;
  variants: QuestionVariant[];
}

export interface Source {
  title: string;
  url: string;
  match_type?: 'exact' | 'related';
}

export interface Visual {
  type: 'mermaid' | 'react_flow' | 'recharts';
  title: string;
  data: string;
  description: string;
}

export interface AIExplanation {
  summary: string;
  answer_content: string;
  visuals?: Visual[];
  sources?: Source[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string | AIExplanation;
}

export type DeepDiveMode = 'eli5' | 'notes';

export interface DeepDiveResult {
  explanation: string;
  mode?: DeepDiveMode;
  audioUrl?: string;
  images?: { url: string; style: string }[];
  sourceText?: string;
}
