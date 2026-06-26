# A/B Testing Strategy

## PURPOSE
This file defines how experimentation should be structured so the product can improve through measurable changes rather than guesswork.

## STRATEGY PRINCIPLES
- Test one meaningful change at a time when possible.
- Tie experiments to a real product goal.
- Define success before launching.
- Use clear primary and secondary metrics.
- Keep variants as small and readable as possible.
- Protect the user experience while testing.
- Do not run experiments without a reason.

## EXPERIMENT TYPES
- CTA copy tests.
- Layout tests.
- Onboarding flow tests.
- Search and filter behavior tests.
- Pricing presentation tests.
- Dashboard hierarchy tests.
- Empty-state or guidance tests.
- Form friction reduction tests.

## EXPERIMENT DESIGN RULES
Every test should define:
- Hypothesis.
- Audience.
- Variant A.
- Variant B.
- Primary metric.
- Secondary metrics.
- Guardrail metrics.
- Duration or stopping criteria.
- Implementation note.
- Risk note.

## RESPONSIVE EXPERIMENT RULES
If the experiment affects layout:
- Test mobile and desktop behavior.
- Ensure one breakpoint improvement does not break another.
- Avoid evaluating success only on desktop if mobile is a major audience.
- Preserve accessibility and clarity in all variants.

## OUTPUT REQUIREMENT
Whenever the AI creates an experiment plan, it must explain how the test is safe, measurable, and worth running.
