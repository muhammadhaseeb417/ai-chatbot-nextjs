// Server-Side API route using OpenRouter instead of Gemini
// Why OpenRouter? Provides free access to multiple AI models with generous limits
// Free models available: Meta Llama, Mistral, and others

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndUpdateRateLimit } from "@/lib/rate-limit";

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free models available on OpenRouter (no cost):
// - meta-llama/llama-3.2-3b-instruct:free (Fast, good for general chat)
// - meta-llama/llama-3.2-1b-instruct:free (Very fast, lighter model)
// - google/gemma-2-9b-it:free (Google's open model)
// - mistralai/mistral-7b-instruct:free (Good balance)

const FREE_MODEL = "meta-llama/llama-3.2-3b-instruct:free"; // Best free model

export async function POST(request: Request) {
  try {
    // Step 1: Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Step 2: Verify email is confirmed
    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Please verify your email before using the chatbot." },
        { status: 403 }
      );
    }

    // Step 3: Check rate limit (this increments the counter)
    const rateLimitResult = await checkAndUpdateRateLimit(user.id);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.message,
          remaining: 0,
        },
        { status: 429 } // 429 = Too Many Requests
      );
    }

    // Step 4: Get user message from request body
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Validate message length (prevent abuse)
    if (message.length > 4000) {
      return NextResponse.json(
        { error: "Message too long. Maximum 4000 characters." },
        { status: 400 }
      );
    }

    // Step 5: Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Chatbot",
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1000, // Limit response length for free tier
        temperature: 0.7, // Balance between creativity and consistency
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);

      // Handle specific error codes
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "AI service rate limit reached. Please try again in a moment.",
          },
          { status: 503 }
        );
      }

      if (response.status === 401) {
        return NextResponse.json(
          { error: "API configuration error. Please contact support." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Failed to get AI response. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract the AI response from OpenRouter's format
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Invalid response from AI service." },
        { status: 500 }
      );
    }

    // Step 6: Return successful response with rate limit info
    return NextResponse.json({
      response: aiResponse,
      remaining: rateLimitResult.remaining,
      model: FREE_MODEL, // Optional: let frontend know which model was used
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    // Type guard for error objects that may contain a 'code' property
    const isErrorWithCode = (err: unknown): err is { code: string } =>
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      typeof (err as Record<string, unknown>).code === "string";

    if (isErrorWithCode(error)) {
      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Unable to connect to AI service. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
