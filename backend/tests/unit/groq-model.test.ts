import { describe, it, expect } from 'vitest';
import { resolveGroqModel, DEFAULT_GROQ_MODEL } from '../../src/providers/llm';

describe('resolveGroqModel', () => {
  it('keeps current Groq model IDs', () => {
    expect(resolveGroqModel('openai/gpt-oss-120b')).toBe('openai/gpt-oss-120b');
    expect(resolveGroqModel('openai/gpt-oss-20b')).toBe('openai/gpt-oss-20b');
  });

  it('maps retired Llama 3.3 to the official replacement', () => {
    expect(resolveGroqModel('llama-3.3-70b-versatile')).toBe(DEFAULT_GROQ_MODEL);
  });
});
