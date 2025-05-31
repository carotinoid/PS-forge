
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cpu, Settings2, Tags, Wand2, ThumbsUp, ThumbsDown, RefreshCcw, FileOutput, FileCheck, FileCode2, ClipboardCopy, SearchCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import type { ProblemStatement, StatementEvaluation, GeneratedCodes, FullProblemEvaluation, Difficulty } from "@/types";
import { AppStep, DIFFICULTIES } from "@/types";

import { generateProblemStatement } from "@/ai/flows/generate-problem-statement";
import { evaluateProblemStatement } from "@/ai/flows/evaluate-problem-statement";
import { generateInputCode } from "@/ai/flows/generate-input-code";
import { generateValidatorCode } from "@/ai/flows/generate-validator-code";
import { generateSolutionCode } from "@/ai/flows/generate-solution-code";
import { evaluateFullProblem } from "@/ai/flows/evaluate-full-problem";

import { FullPageLoading } from "@/components/ps-forge/LoadingSpinner";
import { Stepper } from "@/components/ps-forge/Stepper";
import { SectionCard } from "@/components/ps-forge/SectionCard";


const formSchema = z.object({
  difficulty: z.enum(DIFFICULTIES, { required_error: "Please select a difficulty." }),
  algorithmTags: z.string().min(1, "Please enter at least one algorithm tag."),
});

type UserInputFormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: AppStep.USER_INPUT, name: "Configure" },
  { id: AppStep.REVIEW_STATEMENT, name: "Review Statement" },
  { id: AppStep.REVIEW_FULL_PROBLEM, name: "Review Problem" },
];

export default function PsForgePage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState<AppStep>(AppStep.USER_INPUT);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Generating...");

  const [problemStatement, setProblemStatement] = React.useState<ProblemStatement | null>(null);
  const [statementEvaluation, setStatementEvaluation] = React.useState<StatementEvaluation | null>(null);
  const [generatedCodes, setGeneratedCodes] = React.useState<GeneratedCodes | null>(null);
  const [fullProblemEvaluation, setFullProblemEvaluation] = React.useState<FullProblemEvaluation | null>(null);

  const form = useForm<UserInputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "Medium",
      algorithmTags: "",
    },
  });

  const handleGenerateStatement: SubmitHandler<UserInputFormValues> = async (data) => {
    setIsLoading(true);
    setLoadingMessage("Generating problem statement...");
    try {
      const statement = await generateProblemStatement({
        difficulty: data.difficulty,
        algorithmTags: data.algorithmTags,
      });
      setProblemStatement(statement);
      toast({ title: "Statement Generated", description: "Problem statement created successfully." });

      setLoadingMessage("Evaluating statement...");
      const evaluation = await evaluateProblemStatement({ problemStatement: JSON.stringify(statement) });
      setStatementEvaluation(evaluation);
      toast({ title: "Statement Evaluated", description: "Evaluation complete." });
      
      setCurrentStep(AppStep.REVIEW_STATEMENT);
    } catch (error) {
      console.error("Error generating or evaluating statement:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate or evaluate statement." });
    }
    setIsLoading(false);
  };

  const handleApproveAndGenerateCodes = async () => {
    if (!problemStatement) {
      toast({ variant: "destructive", title: "Error", description: "No problem statement available." });
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Generating code files...");
    try {
      const [inputCode, validatorCode, solutionCode] = await Promise.all([
        generateInputCode({ inputFormat: problemStatement.inputs, problemStatement: JSON.stringify(problemStatement) }),
        generateValidatorCode({ problemStatement: JSON.stringify(problemStatement) }),
        generateSolutionCode({ problemStatement: JSON.stringify(problemStatement) }),
      ]);
      
      const codes: GeneratedCodes = {
        inputGeneratorCode: inputCode.cppCode,
        validatorCode: validatorCode.validatorCode,
        solutionCode: solutionCode.solutionCode,
      };
      setGeneratedCodes(codes);
      toast({ title: "Codes Generated", description: "Input, Validator, and Solution code generated." });

      setLoadingMessage("Performing full evaluation...");
      const fullEval = await evaluateFullProblem({
        statement: JSON.stringify(problemStatement),
        inputs: inputCode.cppCode,
        validator: validatorCode.validatorCode,
        solution: solutionCode.solutionCode,
      });
      setFullProblemEvaluation(fullEval);
      toast({ title: "Full Evaluation Complete", description: "The entire problem package has been assessed." });

      setCurrentStep(AppStep.REVIEW_FULL_PROBLEM);
    } catch (error) {
      console.error("Error generating codes or full evaluation:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate codes or perform full evaluation." });
    }
    setIsLoading(false);
  };

  const handleRegenerateStatement = () => {
    // Keep form values, just re-submit
    form.handleSubmit(handleGenerateStatement)();
  };
  
  const handleStartOver = () => {
    form.reset();
    setProblemStatement(null);
    setStatementEvaluation(null);
    setGeneratedCodes(null);
    setFullProblemEvaluation(null);
    setCurrentStep(AppStep.USER_INPUT);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: "Copied to clipboard", description: `${type} copied successfully.` }))
      .catch(() => toast({ variant: "destructive", title: "Error", description: `Failed to copy ${type}.` }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
      {isLoading && <FullPageLoading message={loadingMessage} />}
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Cpu className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-headline font-bold text-primary">PS Forge</h1>
        </div>
        <p className="text-lg text-muted-foreground font-body">
          Automated Algorithm Problem Generator - Crafting challenges with AI.
        </p>
      </header>

      <div className="w-full max-w-4xl mb-12">
        <Stepper currentStep={currentStep} steps={STEPS} />
      </div>

      <main className="w-full max-w-4xl space-y-8">
        {currentStep === AppStep.USER_INPUT && (
          <SectionCard title="Configure Problem" icon={Settings2} description="Specify the desired difficulty and relevant algorithm tags for your problem.">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerateStatement)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="algorithmTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Algorithm Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dynamic Programming, Graph Theory, BFS" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of relevant algorithms.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Statement
                </Button>
              </form>
            </Form>
          </SectionCard>
        )}

        {currentStep === AppStep.REVIEW_STATEMENT && problemStatement && statementEvaluation && (
          <>
            <SectionCard title="Generated Problem Statement" icon={Info} description={problemStatement.title}>
              <div className="space-y-4">
                <div><strong>Time Limit:</strong> {problemStatement.timeLimit}</div>
                <div><strong>Memory Limit:</strong> {problemStatement.memoryLimit}</div>
                <h3 className="font-semibold mt-2 font-headline">Legend:</h3>
                <Textarea value={problemStatement.legend} readOnly rows={8} className="bg-muted/50 font-code resize-y"/>
                <h3 className="font-semibold mt-2 font-headline">Inputs:</h3>
                <Textarea value={problemStatement.inputs} readOnly rows={5} className="bg-muted/50 font-code resize-y"/>
                <h3 className="font-semibold mt-2 font-headline">Outputs:</h3>
                <Textarea value={problemStatement.outputs} readOnly rows={5} className="bg-muted/50 font-code resize-y"/>
                <h3 className="font-semibold mt-2 font-headline">Example:</h3>
                <Textarea value={problemStatement.example} readOnly rows={6} className="bg-muted/50 font-code resize-y"/>
                {problemStatement.notes && (
                  <>
                    <h3 className="font-semibold mt-2 font-headline">Notes:</h3>
                    <Textarea value={problemStatement.notes} readOnly rows={4} className="bg-muted/50 font-code resize-y"/>
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Statement Evaluation" icon={SearchCheck}
              description={`Quality Score: ${statementEvaluation.qualityScore.toFixed(2)}/1.0 - Suitable: ${statementEvaluation.isSuitable ? 'Yes' : 'No'}`}>
              <p className="font-semibold font-headline">Feedback:</p>
              <Textarea value={statementEvaluation.feedback} readOnly rows={6} className="bg-muted/50 resize-y"/>
            </SectionCard>

            <div className="flex justify-center space-x-4 mt-6">
              <Button onClick={handleApproveAndGenerateCodes} size="lg" disabled={isLoading || !statementEvaluation.isSuitable} variant="default">
                <ThumbsUp className="mr-2 h-5 w-5" />
                Approve & Generate Codes
              </Button>
              <Button onClick={handleRegenerateStatement} size="lg" variant="outline" disabled={isLoading}>
                <RefreshCcw className="mr-2 h-5 w-5" />
                Regenerate Statement
              </Button>
               <Button onClick={handleStartOver} size="lg" variant="ghost" disabled={isLoading}>
                Start Over
              </Button>
            </div>
             {!statementEvaluation.isSuitable && (
                <p className="text-center text-destructive mt-2">This statement is not suitable. Please regenerate or adjust inputs.</p>
              )}
          </>
        )}

        {currentStep === AppStep.REVIEW_FULL_PROBLEM && problemStatement && generatedCodes && fullProblemEvaluation && (
          <>
            <SectionCard title="Generated Problem Statement" icon={Info} description={problemStatement.title}>
              <div className="space-y-2">
                <div><strong>Time Limit:</strong> {problemStatement.timeLimit}</div>
                <div><strong>Memory Limit:</strong> {problemStatement.memoryLimit}</div>
                <details>
                  <summary className="cursor-pointer font-semibold hover:text-primary">View Full Statement Details</summary>
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/50">
                    <h3 className="font-semibold mt-2 font-headline">Legend:</h3>
                    <Textarea value={problemStatement.legend} readOnly rows={8} className="bg-muted/50 font-code resize-y"/>
                    <h3 className="font-semibold mt-2 font-headline">Inputs:</h3>
                    <Textarea value={problemStatement.inputs} readOnly rows={5} className="bg-muted/50 font-code resize-y"/>
                    <h3 className="font-semibold mt-2 font-headline">Outputs:</h3>
                    <Textarea value={problemStatement.outputs} readOnly rows={5} className="bg-muted/50 font-code resize-y"/>
                    <h3 className="font-semibold mt-2 font-headline">Example:</h3>
                    <Textarea value={problemStatement.example} readOnly rows={6} className="bg-muted/50 font-code resize-y"/>
                    {problemStatement.notes && (
                      <>
                        <h3 className="font-semibold mt-2 font-headline">Notes:</h3>
                        <Textarea value={problemStatement.notes} readOnly rows={4} className="bg-muted/50 font-code resize-y"/>
                      </>
                    )}
                  </div>
                </details>
              </div>
            </SectionCard>

            <div className="grid md:grid-cols-3 gap-6">
              {generatedCodes.inputGeneratorCode && (
                <SectionCard title="Input Generator" icon={FileOutput} action={
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedCodes.inputGeneratorCode!, "Input Generator Code")}>
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                }>
                  <Textarea value={generatedCodes.inputGeneratorCode} readOnly rows={12} className="font-code text-xs bg-muted/50 resize-y"/>
                </SectionCard>
              )}
              {generatedCodes.validatorCode && (
                <SectionCard title="Validator" icon={FileCheck} action={
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedCodes.validatorCode!, "Validator Code")}>
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                }>
                  <Textarea value={generatedCodes.validatorCode} readOnly rows={12} className="font-code text-xs bg-muted/50 resize-y"/>
                </SectionCard>
              )}
              {generatedCodes.solutionCode && (
                <SectionCard title="Solver" icon={FileCode2} action={
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedCodes.solutionCode!, "Solution Code")}>
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                }>
                  <Textarea value={generatedCodes.solutionCode} readOnly rows={12} className="font-code text-xs bg-muted/50 resize-y"/>
                </SectionCard>
              )}
            </div>
            
            <SectionCard 
              title="Full Problem Evaluation" 
              icon={fullProblemEvaluation.errorsFound ? AlertTriangle : CheckCircle2} 
              description={fullProblemEvaluation.errorsFound ? "Errors found or inconsistencies detected." : "Problem package seems consistent."}
              className={fullProblemEvaluation.errorsFound ? "border-destructive" : "border-green-500"}
            >
              <h3 className="font-semibold font-headline">Overall Assessment:</h3>
              <Textarea value={fullProblemEvaluation.overallAssessment} readOnly rows={8} className="bg-muted/50 resize-y"/>
              {fullProblemEvaluation.suggestions && (
                <>
                  <h3 className="font-semibold mt-2 font-headline">Suggestions:</h3>
                  <Textarea value={fullProblemEvaluation.suggestions} readOnly rows={5} className="bg-muted/50 resize-y"/>
                </>
              )}
            </SectionCard>

            <div className="flex justify-center space-x-4 mt-6">
               <Button onClick={handleStartOver} size="lg" variant="default" disabled={isLoading}>
                <Wand2 className="mr-2 h-5 w-5" />
                Forge New Problem
              </Button>
              {fullProblemEvaluation.errorsFound && (
                 <Button onClick={handleApproveAndGenerateCodes} size="lg" variant="outline" disabled={isLoading}>
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Regenerate Codes & Re-evaluate
                </Button>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="w-full max-w-5xl mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground font-body">
          PS Forge &copy; {new Date().getFullYear()}. Powered by Genkit AI.
        </p>
      </footer>
    </div>
  );
}

    