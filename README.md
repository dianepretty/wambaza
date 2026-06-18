# Wambaza — Multilingual ASRH Question Answering Platform

> **"Wambaza"** means *"you can ask me"* in Kinyarwanda.

Wambaza is a multilingual platform that delivers accurate, linguistically inclusive adolescent sexual and reproductive health (ASRH) guidance in **English**, **Kinyarwanda**, and **Luganda**. It serves adolescents in Rwanda and Uganda who face cultural stigma, language barriers, and limited access to private health information.

---

## The Problem

In Rwanda, teenage pregnancy has risen to 8% among girls aged 15 to 19, and in Uganda, adolescent girls account for roughly one third of all new HIV infections annually. Existing digital ASRH platforms are either rule-based, English-only, or geographically limited — no system currently provides intelligent, multilingual ASRH question answering in both Kinyarwanda and Luganda.

## What Wambaza Does

- Publishes verified ASRH articles in English, Kinyarwanda, and Luganda, written and managed by approved publishers
- Lets adolescents browse, search, and read articles without creating an account
- Accepts ASRH questions anonymously through an AI chat assistant, with automatic language detection
- Attaches a confidence score to every AI response, flagging low-confidence answers for follow-up with a professional
- Gives admins tools to manage publisher accounts and moderate published content

This repo is the **frontend** (Next.js 14 + Tailwind). The API lives in a separate [backend repo](https://github.com/dianepretty/wambaza_backend).

---

## Frontend pages

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, Ask AI banner, latest articles, trust stats |
| `/stories` | Full article catalogue with search |
| `/articles/[id]` | Public article reader, per-language tabs |
| `/ask` | AI chat assistant, no login required |
| `/signin` | Publisher/admin sign-in, OTP-based forgot password |
| `/change-password` | Forced password change on first login |
| `/publisher` | Publisher dashboard — manage own articles (draft/published/archived) |
| `/publisher/editor` | Article editor — multilingual fields, header image upload |
| `/publisher/profile` | Publisher account settings (name/email) |
| `/admin` | Admin dashboard — manage publishers and moderate all articles |
| `/admin/profile` | Admin account settings (name/email) |

## Local setup

### Prerequisites

- Node.js 18+

### Run locally

```bash
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

(point this at wherever the [backend](https://github.com/dianepretty/wambaza_backend) is running)

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## ASRH model & dataset

The AI assistant's question-answering model is trained separately; the training notebook and data live in this repo for reference.

```
wambaza/
├── app/                                 # Next.js frontend (see table above)
├── components/                          # Shared UI components
├── assets/                              # Images used by the frontend
├── Wambaza_Model_Notebook.ipynb         # Data analysis, model training, evaluation
├── Data/
│   ├── Train.csv                        # HASH training data (21,444 rows)
│   ├── Val.csv                          # HASH validation data (4,592 rows)
│   └── Test.csv                         # HASH test data (1,836 rows)
└── Plots/
    ├── answer_length.png
    ├── Question_length.png
    └── language_distribution.png
```

The model pipeline (retrieval + generation) is:
- A LangChain RAG pipeline retrieving from a verified knowledge base
- A fine-tuned mT5-base model generating grounded answers
- A confidence score attached to every response, surfaced in the `/ask` page

### Dataset

Training data comes from the **HASH Multilingual Health QA Challenge** (Zindi / ITU, 2026), a health-worker-validated corpus of ASRH question-answer pairs in English, Luganda, Akan, Amharic, and Kiswahili. We filter to English and Luganda, then extend with a Kinyarwanda subset generated via machine translation.

| Split | Rows | Languages |
|---|---|---|
| Train | 21,444 | English, Luganda |
| Validation | 4,592 | English, Luganda |
| Test | 1,836 | English, Luganda |

> Kinyarwanda (~3,000 training pairs) will be added via the translation pipeline. The live `/model/ask` endpoint currently returns a placeholder response until the trained model is integrated into the backend.

### Running the notebook

1. Upload `Train.csv`, `Val.csv`, `Test.csv` to Google Drive under `MyDrive/Multilingual data/`
2. Open `Wambaza_Model_Notebook.ipynb` in [Google Colab](https://colab.research.google.com)
3. Set runtime to **T4 GPU** (`Runtime → Change runtime type → T4 GPU`)
4. Run all cells top to bottom — the first cell installs all required packages

---

## Links

- [GitHub](https://github.com/dianepretty/wambaza)
- [Backend repo](https://github.com/dianepretty/wambaza_backend)
- [YouTube demo](https://youtu.be/vKweA_lksHQ)

## Author

**Diane Pretty Ntakirutimana**
BSc. Software Engineering, African Leadership University
2026
