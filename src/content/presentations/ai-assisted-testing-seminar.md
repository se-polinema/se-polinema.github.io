---
title: "AI-Assisted Software Testing: From Research to Practice"
titleId: "Pengujian Perangkat Lunak Berbantuan AI: Dari Riset ke Praktik"
event: ai-assisted-testing-seminar
author: SE Lab
date: 2026-07-15
theme: auto
---

# AI-Assisted Software Testing
## From Research to Practice

SE Lab · JTI Polinema

Note: Welcome! Check your clicker and open the speaker view (press S).

---

## Agenda

1. Why AI in Software Testing?
2. Automated Test Generation
3. Bug Prediction Models
4. Quality Analysis Tools
5. Live Demo
6. Q & A

Note: Estimated 45 minutes. Keep 15 minutes for Q&A.

---

## Why AI in Software Testing?

- **Scale**: Modern codebases grow faster than manual test coverage can keep up
- **Consistency**: Machines don't get tired; coverage doesn't regress on Friday afternoon
- **Speed**: AI-assisted test generation cuts authoring time by 60–80% in our studies

> "Testing is not about finding bugs — it's about building confidence."

Note: Cite the 2025 Polinema pilot study here.

---

## Automated Test Generation

```python
# Without AI: manual unit test
def test_calculate_discount():
    assert calculate_discount(100, 0.1) == 90

# With AI (e.g. EvoSuite / GitHub Copilot):
# auto-generated from method signature + docstring
def test_calculate_discount_boundary():
    assert calculate_discount(0, 0.99) == 0
    assert calculate_discount(1000, 0.0) == 1000
```

Tools: **EvoSuite**, **Pynguin**, **GitHub Copilot**, **CodiumAI**

Note: Show the Copilot demo here. Time box to 5 minutes.

---

## Bug Prediction Models

| Model | F1 Score | Data Required |
|-------|----------|---------------|
| CodeBERT fine-tuned | 0.84 | Git history |
| Random Forest (metrics) | 0.71 | Halstead / CK |
| GPT-4 zero-shot | 0.68 | Source only |

Our lab's fine-tuned model: **0.87** on JTI internal repos.

Note: Dataset is not public yet — mention the IRB submission.

---

## Live Demo

- Repository: `se-polinema/ai-test-demo`
- Tool: GitHub Copilot + CodiumAI VS Code extension
- Target: uncovered `PaymentService` class

**Demo steps:**
1. Open uncovered file
2. Invoke AI test generation
3. Review & accept suggestions
4. Run coverage report

Note: Have VS Code open with the demo repo pre-loaded. Fallback: recorded video on USB.

---

## Q & A

Thank you!

**Contact**
📧 se-lab@polinema.ac.id
🌐 se-polinema.github.io

Note: Stay for coffee — informal discussions welcome.
