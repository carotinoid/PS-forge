import { config } from 'dotenv';
config();

import '@/ai/flows/generate-solution-code.ts';
import '@/ai/flows/evaluate-problem-statement.ts';
import '@/ai/flows/generate-problem-statement.ts';
import '@/ai/flows/generate-input-code.ts';
import '@/ai/flows/generate-validator-code.ts';
import '@/ai/flows/evaluate-full-problem.ts';