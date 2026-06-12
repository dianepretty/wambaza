# Wambaza — Multilingual ASRH Question Answering Platform

> **"Wambaza"** means *"you can ask me"* in Kinyarwanda.

Wambaza is a multilingual AI-powered web platform that delivers accurate and linguistically inclusive adolescent sexual and reproductive health (ASRH) guidance in **English**, **Kinyarwanda**, and **Luganda**. It is designed to serve adolescents in Rwanda and Uganda who face cultural stigma, language barriers, and limited access to private health information.

---

## The Problem

In Rwanda, teenage pregnancy has risen to 8% among girls aged 15 to 19, and in Uganda, adolescent girls account for approximately one third of all new HIV infections annually. Existing digital ASRH platforms are either rule-based, English-only, or geographically limited. No system currently provides intelligent, multilingual ASRH question answering in both Kinyarwanda and Luganda.

---

## What Wambaza Does

- Accepts ASRH questions anonymously in English, Kinyarwanda, or Luganda
- Automatically detects the input language
- Retrieves relevant content from a verified knowledge base using a LangChain RAG pipeline
- Generates a grounded, medically accurate answer using a fine-tuned mT5-base model
- Attaches a confidence score to every response
- Redirects low-confidence responses to a qualified health professional
- Allows Ministry of Health administrators/ Health professionals to publish verified ASRH articles

---

## Current Project Structure

```
wambaza/
│
├── notebook/
│   └── Wambaza_Model_Notebook.ipynb   # Data analysis, model training, evaluation
│
├── data/
│   ├── Train.csv                       # HASH training data (21,444 rows)
│   ├── Val.csv                         # HASH validation data (4,592 rows)
│   └── Test.csv                        # HASH test data (1,836 rows)
│
└── plots/
    ├── fig1_language_distribution.png  # Language distribution bar chart
    ├── fig2_question_length.png        # Question length distribution
    └── fig3_answer_length.png          # Answer length distribution
```

> Backend, frontend, and model weight directories will be added in subsequent phases of development.

---

## Environment Setup

### Prerequisites

- Python 3.10 or higher
- A Google account (for Google Colab and Google Drive)
- Google Colab Pro (for T4 GPU access during model training)

---

### 1. Clone the Repository

```bash
git clone https://github.com/dianepretty/wambaza.git
cd wambaza
```

---

### 2. Set Up Google Drive

Upload your data files to Google Drive in a folder called `Multilingual data`:

```
MyDrive/
└── Multilingual data/
    ├── Train.csv
    ├── Val.csv
    └── Test.csv
└──Plots
    ├── answer_length.png
    ├── Question_length.png
    └── language_distribution.png

```

### 3. Open the Notebook in Google Colab

1. Go to [colab.research.google.com](https://colab.research.google.com)
2. Open `Wambaza_Model_Notebook.ipynb`
3. Change runtime to T4 GPU:
```
Runtime → Change runtime type → T4 GPU → Save
```
4. Run all cells in order from top to bottom

---

### 4. Install Required Packages

The first cell in the notebook installs everything automatically:

```python
!pip install -q pandas numpy matplotlib seaborn
!pip install -q transformers sentencepiece accelerate torch
!pip install -q rouge-score scikit-learn
!pip install -q langchain chromadb sentence-transformers
!pip install -q peft
```

---

## Dataset

The training data comes from the **HASH Multilingual Health QA Challenge** (Zindi / ITU, 2026), a health-worker-validated corpus of ASRH question-answer pairs in English, Luganda, Akan, Amharic, and Kiswahili. We filter to English and Luganda only, then extend with a Kinyarwanda subset generated via machine translation.

| Split | Rows | Languages |
|---|---|---|
| Train | 21,444 | English, Luganda |
| Validation | 4,592 | English, Luganda |
| Test | 1,836 | English, Luganda |

> Kinyarwanda (~3,000 training pairs) will be added via the translation pipeline.

---

## Author

**Diane Pretty Ntakirutimana**
BSc. Software Engineering
African Leadership University
2026
