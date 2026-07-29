export async function submitForm(
  type: 'contact' | 'quote' | 'newsletter',
  data: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || 'Submission failed' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
