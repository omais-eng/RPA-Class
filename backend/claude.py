import os
import json
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

PROMPT_TEMPLATE = """You are a study assistant. Based on the following input, generate study material.

Input: {user_input}

Generate the following in valid JSON format:
{{
  "flashcards": [
    {{ "question": "...", "answer": "..." }}
  ],
  "quiz": [
    {{
      "question": "...",
      "options": {{ "A": "...", "B": "...", "C": "...", "D": "..." }},
      "correct": "A"
    }}
  ],
  "summary": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4", "bullet point 5"],
  "fill_in_the_blank": [
    {{ "sentence": "The ___ is responsible for ...", "answer": "keyword" }}
  ]
}}

Generate 7 flashcards, 5 quiz questions, 5 summary bullet points, and 7 fill-in-the-blank sentences.
Return only valid JSON. No extra text, no markdown, no code blocks."""


def generate_study_material(user_input: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(user_input=user_input)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()

    # Strip markdown code blocks if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)
