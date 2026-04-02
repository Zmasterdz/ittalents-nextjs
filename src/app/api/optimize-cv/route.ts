import { NextRequest, NextResponse } from "next/server";
import { SALARY_DATA, type SalaryEntry } from "@/lib/salary-data";

// --- GLM API Config ---
const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

// --- Salary Matching ---
function matchSalary(
  salaryData: SalaryEntry[],
  targetPosition: string
): SalaryEntry[] {
  if (!targetPosition || targetPosition === "Non spécifié") return [];

  const normalized = targetPosition
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const scored = salaryData.map((entry) => {
    const entryNorm = entry.job
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (entryNorm === normalized) return { entry, score: 100 };
    if (entryNorm.includes(normalized) || normalized.includes(entryNorm))
      return { entry, score: 85 };

    const entryWords = new Set(entryNorm.split(/[\s\/\-_()]+/));
    const targetWords = new Set(normalized.split(/[\s\/\-_()]+/));
    let overlap = 0;
    for (const w of targetWords) {
      if (entryWords.has(w)) overlap++;
    }
    const ratio = overlap / Math.max(targetWords.size, 1);
    if (ratio >= 0.5) return { entry, score: Math.round(ratio * 80) };

    return { entry, score: 0 };
  });

  return scored
    .filter((s) => s.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.entry);
}

function formatDZD(amount: number): string {
  return amount.toLocaleString("fr-DZ");
}

function buildSalaryContext(salaryData: SalaryEntry[]): string {
  if (salaryData.length === 0) return "";
  const lines = salaryData.map(
    (s) =>
      `  - ${s.job} : ${formatDZD(s.min)} - ${formatDZD(s.max)} DZD/mois`
  );
  return `\n\nDONNÉES DE SALAIRE RÉELLES (source : ITTalentsdzpro, marché algérien) :\n${lines.join(
    "\n"
  )}\n\nIMPORTANT : Utilise ces données réelles pour donner une estimation salariale précise. Si le profil correspond à un de ces postes, donne la fourchette exacte.`;
}

// --- AI System Prompt ---
const SYSTEM_PROMPT = `Tu es un expert en recrutement IT spécialisé dans le marché algérien. Tu analyses les CV et fournis des recommandations détaillées et personnalisées pour aider les candidats à décrocher des postes IT en Algérie.

Tu dois TOUJOURS répondre en français. Structure ta réponse avec les sections suivantes (utilise exactement ces titres avec les emojis) :

## 📊 Score Global du CV
Donne UNIQUEMENT un nombre entre 0 et 100 sur la première ligne (ex: "75/100"), puis une courte justification sur la ligne suivante.

## ✅ Points Forts
Liste 3-5 points forts du CV identifiés, un par ligne avec "- ".

## ⚠️ Points à Améliorer
Liste 3-5 aspects qui pourraient être améliorés, un par ligne avec "- ".

## 🎯 Recommandations pour le Poste Visé
Donne des recommandations spécifiques pour le poste ciblé :
- Compétences techniques à ajouter ou mettre en avant
- Expériences à valoriser
- Certifications recommandées
- Projets personnels suggérés

## 💰 Salaire Estimé en Algérie
Donne une estimation précise en DZD/mois. Utilise les données de salaire fournies si disponibles. Format : "Fourchette : X DZD - Y DZD / mois" sur la première ligne, puis une explication.

## 🔗 Ressources Utiles
Suggère des plateformes de formation, certifications, et communautés IT pertinentes en Algérie. Un par ligne avec "- ".

## 📝 Version Optimisée du Résumé
Propose une version optimisée du résumé professionnel (3-4 lignes percutantes).

Sois constructif, précis et spécifique au marché IT algérien. Référence-toi aux standards du marché local (entreprises algériennes, ESN algériennes, startups, etc.).`;

export async function POST(request: NextRequest) {
  try {
    const { cvContent, targetPosition } = await request.json();

    // Validate input
    if (!cvContent || cvContent.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le contenu du CV est trop court. Veuillez fournir au moins 50 caractères.",
        },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GLMAPIKEY;
    if (!apiKey) {
      console.error("GLMAPIKEY environment variable is not set.");
      return NextResponse.json(
        {
          success: false,
          error:
            "La clé API n'est pas configurée. Veuillez contacter l'administrateur.",
        },
        { status: 500 }
      );
    }

    // Match salary data
    const matchedSalary = matchSalary(
      SALARY_DATA,
      targetPosition || "Non spécifié"
    );
    const salaryContext = buildSalaryContext(matchedSalary);

    // Build user message
    const userMessage = `Voici le contenu du CV à analyser :

---
${cvContent}
---

${targetPosition ? `Poste visé : ${targetPosition}` : "Poste visé : Non spécifié (analyse générale IT)"}
${salaryContext}

Analyse ce CV en profondeur et fournis des recommandations personnalisées pour le marché IT algérien.`;

    // Call GLM API (ZhipuAI)
    const completion = await fetch(GLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GLM_MODEL || "GLM-4.5-Flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.9,
      }),
    });

    if (!completion.ok) {
      const errorBody = await completion.text();
      console.error("GLM API Error:", completion.status, errorBody);
      return NextResponse.json(
        {
          success: false,
          error: `Erreur API IA (${completion.status}). Veuillez réessayer.`,
        },
        { status: 502 }
      );
    }

    const data = await completion.json();
    const response = data.choices?.[0]?.message?.content;

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Erreur lors de l'analyse. La réponse IA est vide. Veuillez réessayer.",
        },
        { status: 500 }
      );
    }

    // Return results
    return NextResponse.json({
      success: true,
      recommendations: response,
      salaryRange:
        matchedSalary.length > 0
          ? {
              min: matchedSalary[0].min,
              max: matchedSalary[0].max,
              job: matchedSalary[0].job,
              similarJobs: matchedSalary.slice(0, 3).map((s) => ({
                job: s.job,
                min: s.min,
                max: s.max,
              })),
            }
          : null,
    });
  } catch (error: unknown) {
    console.error("CV Analysis Error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json(
      { success: false, error: `Une erreur est survenue : ${message}.` },
      { status: 500 }
    );
  }
}
