

def format_evidence(chunks: list[dict]) -> str:
    evidence_blocks = []

    for index, chunk in enumerate(chunks, start=1):
        evidence_blocks.append(
            f"""
                Evidence {index}
                Chunk ID: {chunk.get("chunk_id")}
                Source table: {chunk.get("source_table")}
                Source type: {chunk.get("source_type")}
                Title: {chunk.get("title")}
                Distance: {chunk.get("distance")}

                Text: {chunk.get("chunk_text")}
            """.strip())
        
    return "\n\n----\n\n".join(evidence_blocks)


def build_rag_answer_prompt(
        question: str,
        chunks: list[dict],
        vehicle_id: str | None = None,
        variant_id: str | None = None) -> str:
    
    evidence_text = format_evidence(chunks)

    rag_answer_prompt = f"""
                            You are RedlineIQ Build Copilot.
                            Vehicle context:
                            - vehicle_id: {vehicle_id}
                            - variant_id: {variant_id}

                            User question:
                            {question}

                            Retrieved evidence:
                            {evidence_text}

                            Rules:
                            - Use only the retrieved evidence for factual claims.
                            - Do not invent product claims, fitment, prices, dyno numbers, lap times, or reliability outcomes.
                            - If the evidence is weak or missing, say that.
                            - Separate stated evidence from inferred recommendation.
                            - Be practical and concise.
                            - Mention risks and dependencies when relevant.

                            Return your answer in this exact structure:

                            ## Short Answer

                            ## Recommendation

                            ## Evidence Used

                            ## Risks / Dependencies

                            ## Stated Evidence vs Inference

                            ## Confidence
                            Give a confidence score from 0 to 1 and explain why.
                            """.strip()
    
    return rag_answer_prompt

# This is to explain the build from the sugested parts
def build_explanation_prompt(recommendations: dict, chunks: list[dict]) -> str:
    evidence_text = format_evidence(chunks)

    products = recommendations.get("recommend_products", [])

    product_lines = []
    for product in products:
        product_lines.append(
            f"- {product.get('product_name')} | "
            f"brand={product.get('brand')} | "
            f"category={product.get('system_category')} | "
            f"price={product.get('price')} | "
            f"score={product.get('recommendation_score')}"
        )
    
    product_text = "\n".join(product_lines)

    build_recommendation_prompt = f"""
                                You are RedlineIQ Build Copilot.
                                The system has already selected compatible candidate parts using structured database logic.
                                Your job is to explain the recommendation using the retrieved evidence.

                                Build context:
                                - vehicle_id: {recommendations.get("vehicle_id")}
                                - variant_id: {recommendations.get("variant_id")}
                                - use_case: {recommendations.get("use_case")}
                                - target_whp: {recommendations.get("target_whp")}
                                - budget: {recommendations.get("budget")}
                                - estimated_total_cost: {recommendations.get("estimated_total_cost")}

                                Recommended products:
                                {product_text}

                                Retrieved evidence:
                                {evidence_text}

                                Rules:
                                - Do not recommend new parts outside the provided recommendation list.
                                - Do not invent claims.
                                - Use retrieved evidence only.
                                - If evidence does not fully support something, call that out.
                                - Separate direct evidence from inference.
                                - Explain risks such as tuning, fueling, cooling, emissions, reliability, or install complexity.

                                Return your answer in this exact structure:

                                ## Build Summary

                                ## Why These Parts Fit the Goal

                                ## Supporting Evidence

                                ## Risks and Dependencies

                                ## What Is Directly Supported vs Inferred

                                ## Confidence Score
                                Give a score from 0 to 1.
                                """.strip()
    
    return build_recommendation_prompt  