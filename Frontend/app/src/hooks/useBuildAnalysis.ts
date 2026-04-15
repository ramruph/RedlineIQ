import { useCallback, useState } from "react";
import { analyzeBuild } from "../api/analyze";
import type {
  AnalyzeBuildRequest,
  BuildAnalysisResult,
} from "../types/api";

export function useBuildAnalysis() {
  const [analysis, setAnalysis] = useState<BuildAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (payload: AnalyzeBuildRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeBuild(payload);
      setAnalysis(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown analysis error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analysis,
    isLoading,
    error,
    runAnalysis,
    setAnalysis,
  };
}