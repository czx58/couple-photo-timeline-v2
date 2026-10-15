export interface IeltsQuestion {
  id: string;
  topic: string;
  question: string;
  bulletPoints: string[];
  category: 'person' | 'place' | 'event' | 'object';
}

export const ieltsQuestions: IeltsQuestion[] = [
  {
    id: 'p2-001',
    topic: 'Describe a person you admire',
    question: 'Describe a person you admire.',
    bulletPoints: [
      'Who this person is',
      'How you know this person',
      'What this person does',
      'And explain why you admire this person',
    ],
    category: 'person',
  },
  {
    id: 'p2-002',
    topic: 'Describe a place you visited when you were a child',
    question: 'Describe a place you visited when you were a child.',
    bulletPoints: [
      'Where this place is',
      'When you went there',
      'What you did there',
      'And explain why you remember this place',
    ],
    category: 'place',
  },
  {
    id: 'p2-003',
    topic: 'Describe a memorable event',
    question: 'Describe a memorable event you have attended.',
    bulletPoints: [
      'What event it was',
      'When and where it was held',
      'Who you went with',
      'And explain why it was memorable',
    ],
    category: 'event',
  },
  {
    id: 'p2-004',
    topic: 'Describe an important object',
    question: 'Describe an object that is important to you.',
    bulletPoints: [
      'What the object is',
      'Where you got it',
      'How often you use it',
      'And explain why it is important to you',
    ],
    category: 'object',
  },
  {
    id: 'p2-005',
    topic: 'Describe a skill you want to learn',
    question: 'Describe a skill you would like to learn in the future.',
    bulletPoints: [
      'What skill it is',
      'Why you want to learn it',
      'How you plan to learn it',
      'And explain how this skill will help you',
    ],
    category: 'object',
  },
];

export function getRandomQuestion(): IeltsQuestion {
  const index = Math.floor(Math.random() * ieltsQuestions.length);
  return ieltsQuestions[index];
}
