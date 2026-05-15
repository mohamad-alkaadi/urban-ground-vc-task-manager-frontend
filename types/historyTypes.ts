export declare interface Content {
  role: string;
  parts: Part[];
}
export declare type Part =
  | TextPart
  | InlineDataPart
  | FunctionCallPart
  | FunctionResponsePart
  | FileDataPart
  | ExecutableCodePart
  | CodeExecutionResultPart;
export declare interface TextPart {
  text: string;
  inlineData?: never;
  functionCall?: never;
  functionResponse?: never;
  fileData?: never;
  executableCode?: never;
  codeExecutionResult?: never;
}

export declare interface InlineDataPart {
  text?: never;
  inlineData: GenerativeContentBlob;
  functionCall?: never;
  functionResponse?: never;
  fileData?: never;
  executableCode?: never;
  codeExecutionResult?: never;
}
export declare interface GenerativeContentBlob {
  mimeType: string;
  /**
   * Image as a base64 string.
   */
  data: string;
}

export declare interface FunctionCallPart {
  text?: never;
  inlineData?: never;
  functionCall: FunctionCall;
  functionResponse?: never;
  fileData?: never;
  executableCode?: never;
  codeExecutionResult?: never;
}
export declare interface FunctionCall {
  name: string;
  args: object;
}

export declare interface FunctionResponsePart {
  text?: never;
  inlineData?: never;
  functionCall?: never;
  functionResponse: FunctionResponse;
  fileData?: never;
  executableCode?: never;
  codeExecutionResult?: never;
}

export declare interface FunctionResponse {
  name: string;
  response: object;
}
export declare interface FileDataPart {
  text?: never;
  inlineData?: never;
  functionCall?: never;
  functionResponse?: never;
  fileData: FileData;
  executableCode?: never;
  codeExecutionResult?: never;
}
export declare interface FileData {
  mimeType: string;
  fileUri: string;
}
export declare interface ExecutableCodePart {
  text?: never;
  inlineData?: never;
  functionCall?: never;
  functionResponse?: never;
  fileData?: never;
  executableCode: ExecutableCode;
  codeExecutionResult?: never;
}
export declare interface ExecutableCode {
  /**
   * Programming language of the `code`.
   */
  language: ExecutableCodeLanguage;
  /**
   * The code to be executed.
   */
  code: string;
}
export declare enum ExecutableCodeLanguage {
  LANGUAGE_UNSPECIFIED = "language_unspecified",
  PYTHON = "python",
}
export declare interface CodeExecutionResultPart {
  text?: never;
  inlineData?: never;
  functionCall?: never;
  functionResponse?: never;
  fileData?: never;
  executableCode?: never;
  codeExecutionResult: CodeExecutionResult;
}
export declare interface CodeExecutionResult {
  /**
   * Outcome of the code execution.
   */
  outcome: Outcome;
  /**
   * Contains stdout when code execution is successful, stderr or other
   * description otherwise.
   */
  output: string;
}
export declare enum Outcome {
  /**
   * Unspecified status. This value should not be used.
   */
  OUTCOME_UNSPECIFIED = "outcome_unspecified",
  /**
   * Code execution completed successfully.
   */
  OUTCOME_OK = "outcome_ok",
  /**
   * Code execution finished but with a failure. `stderr` should contain the
   * reason.
   */
  OUTCOME_FAILED = "outcome_failed",
  /**
   * Code execution ran for too long, and was cancelled. There may or may not
   * be a partial output present.
   */
  OUTCOME_DEADLINE_EXCEEDED = "outcome_deadline_exceeded",
}
