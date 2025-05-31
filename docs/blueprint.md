# **App Name**: PS Forge

## Core Features:

- Statement Generation: Statement Generator: Generates a problem statement, including title, time limit, memory limit, legend, inputs, outputs, example, and notes, based on user-specified difficulty and algorithm tags, using an LLM tool.
- Statement Evaluation: Statement Evaluator: Assesses the quality and suitability of generated problem statements, filtering for well-formed and interesting problems, using an LLM tool.
- User Feedback: User Feedback Loop: Presents the generated problem to the user for approval and incorporates their feedback before proceeding.
- Input Generation: Input Generator: Creates C++ code to automatically generate inputs that conform to the problem statement's input format, using an LLM tool.
- Input Validation: Validator: Generates C++ code to validate whether the generated inputs adhere to the problem statement's specifications, leveraging testlib.h if necessary, using an LLM tool.
- Solution Generation: Solver: Produces a correct solution code (in C++) for the generated problem, using an LLM tool.
- Full Evaluation: Overall Evaluator: Conducts a thorough assessment of the entire problem-solving package, checking for errors and inconsistencies across the statement, inputs, validator, and solution, using an LLM tool.

## Style Guidelines:

- Primary color: Deep violet (#9400D3) for an intellectual and sophisticated feel, reflecting the complexity of algorithm problem solving.
- Background color: Very light violet (#F0E5F5), offering a gentle contrast to the primary color in a light scheme.
- Accent color: Darker, muted blue (#483D8B), positioned to the 'left' of violet, creates emphasis without overwhelming.
- Headline font: 'Space Grotesk' (sans-serif) for a tech-oriented feel.
- Body text: 'Inter' (sans-serif), paired with Space Grotesk for a neutral, readable style in longer descriptions.
- Code font: 'Source Code Pro' (monospace) for clear display of generated code.
- Use simple, geometric icons representing algorithm concepts and difficulty levels.