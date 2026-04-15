import { apiRequest } from "./clients";
import type { AnalyzeBuildRequest, BuildAnalysisResult } from "../types/api";

export async function analyzeBuild(
  payload: AnalyzeBuildRequest
): Promise<BuildAnalysisResult> {
  return apiRequest<BuildAnalysisResult>("/analyze-build", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}