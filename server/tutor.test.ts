import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("tutor.explainConcept", () => {
  it("generates an explanation for a concept", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tutor.explainConcept({
      concept: "Present Simple",
      context: "Basic verb conjugation",
      userLevel: "A1",
    });

    expect(result).toHaveProperty("explanation");
    expect(typeof result.explanation).toBe("string");
    expect(result.explanation.length).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for LLM call
});

describe("tutor.getFeedback", () => {
  it("provides feedback on user error", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tutor.getFeedback({
      question: "What is the past tense of 'go'?",
      userAnswer: "goed",
      correctAnswer: "went",
      topic: "Irregular verbs",
    });

    expect(result).toHaveProperty("feedback");
    expect(typeof result.feedback).toBe("string");
    expect(result.feedback.length).toBeGreaterThan(0);
  }, 30000);
});

describe("tutor.getHint", () => {
  it("provides a hint without revealing the answer", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tutor.getHint({
      question: "Complete: I ___ to school every day.",
      context: "Present Simple tense",
    });

    expect(result).toHaveProperty("hint");
    expect(typeof result.hint).toBe("string");
    expect(result.hint.length).toBeGreaterThan(0);
  }, 30000);
});
