"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Star,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code2,
  MessageSquare,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle, SidebarToggle } from "@/components/theme-toggle";

const TARGET_POSITIONS = [
  "Développeur Full Stack",
  "Développeur Frontend",
  "Développeur Backend",
  "Développeur Mobile",
  "DevOps Engineer",
  "Administrateur Système",
  "Data Analyst",
  "Data Scientist",
  "Ingénieur IA/ML",
  "Chef de Projet IT",
  "Scrum Master",
  "UI/UX Designer",
  "Administrateur Base de Données",
  "Consultant Sécurité",
  "Architecte Logiciel",
  "Testeur QA",
  "Autre",
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [cvContent, setCvContent] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [customPosition, setCustomPosition] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 4 + 1, 95));
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isAnalyzing]);

  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const stages = [
    { percent: 10, message: "📥 Lecture du CV...", duration: 10000 },
    { percent: 30, message: "🔍 Analyse des compétences...", duration: 30000 },
    { percent: 50, message: "💼 Matching avec le marché IT algérien...", duration: 60000 },
    { percent: 75, message: "🧠 Génération des recommandations IA...", duration: 90000 },
    { percent: 95, message: "✅ Finalisation et vérification...", duration: 30000 },
  ];

  React.useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      return;
    }

    let currentStage = 0;
    const totalDuration = 300000; // 5 minutes max
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].percent);
        currentStage++;
      } else {
        setProgress(100);
      }
    }, 20000); // Advance stage every 20s, adjust for realism

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = useCallback(async () => {
    if (!cvContent.trim() || cvContent.trim().length < 50) {
      toast({
        title: "CV trop court",
        description:
          "Veuillez fournir au moins 50 caractères de contenu de CV.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const position =
        targetPosition === "Autre"
          ? customPosition
          : targetPosition || "Non spécifié";

      const response = await fetch("/api/optimize-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvContent: cvContent.trim(),
          targetPosition: position,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Erreur lors de l'analyse.");
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de l'analyse.",
          variant: "destructive",
        });
        return;
      }

      setResult(data.recommendations);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      toast({
        title: "Analyse terminée !",
        description: "Vos recommandations personnalisées sont prêtes.",
      });
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
      toast({
        title: "Erreur de connexion",
        description:
          "Impossible de contacter le serveur. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [cvContent, targetPosition, customPosition, toast]);

  const handleReset = useCallback(() => {
    setCvContent("");
    setTargetPosition("");
    setCustomPosition("");
    setResult(null);
    setError(null);
  }, []);

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      toast({
        title: "Copié !",
        description:
          "Les recommandations ont été copiées dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, toast]);

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="text-xl font-bold text-foreground mt-6 mb-3 flex items-center gap-2"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-lg font-semibold text-foreground mt-4 mb-2"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-muted-foreground ml-4 mb-1 list-disc">
            {renderInlineMarkdown(line.replace(/^[-*] /, ""))}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={i} className="text-muted-foreground ml-4 mb-1 list-decimal">
            {renderInlineMarkdown(line.replace(/^\d+\.\s*/, ""))}
          </li>
        );
      }
      if (line.startsWith("---")) {
        return <Separator key={i} className="my-4 bg-border/50" />;
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      return (
        <p key={i} className="text-muted-foreground mb-2 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-primary"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 lg:p-12 min-h-screen">
      {/* Hero Section */}
      <section id="home" className="hero-gradient relative overflow-hidden noise-overlay">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <div className="orb-float absolute top-16 left-[10%] w-72 h-72 rounded-full bg-primary/8 blur-3xl" />
          <div className="orb-float-delayed absolute bottom-8 right-[5%] w-96 h-96 rounded-full bg-teal-500/6 blur-3xl" />
          <div className="orb-float-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-400/5 blur-3xl" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div {...fadeInUp}>
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 text-primary border-white/10 hover:bg-white/15 backdrop-blur-sm"
            >
              <Star className="w-3.5 h-3.5 mr-1.5" />
              Propulsé par l&apos;IA
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Optimisez votre{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                carrière IT
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/50 via-teal-400/50 to-emerald-400/50 rounded-full blur-sm" />
            </span>{" "}
            en Algérie
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Collez le contenu de votre CV et obtenez des recommandations
            personnalisées pour décrocher le poste de vos rêves.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/85 text-primary-foreground font-semibold px-8 py-6 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 rounded-xl"
              onClick={() =>
                document
                  .getElementById("cv-input")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Optimiser mon CV
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a
              href="https://ittalentsdzpro.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 text-white/90 hover:bg-white/10 hover:text-white font-medium px-8 py-6 text-base rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Découvrir ITTalentsdzpro
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: "50+", label: "Postes IT" },
              { value: "100%", label: "Gratuit" },
              { value: "🇩🇿", label: "Algérie" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/45 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {/* CV Input Section */}
        <section
          id="cv-input"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-border/60 shadow-2xl shadow-black/20 overflow-hidden bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/8 to-primary/4 px-6 py-5 border-b border-border/40">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shadow-lg shadow-primary/15">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="block">Collez votre CV</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Notre IA analysera votre profil pour le marché IT algérien
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Target Position */}
                <div className="space-y-2">
                  <Label
                    htmlFor="target-position"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Target className="w-4 h-4 text-primary" />
                    Poste visé (optionnel)
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                      value={targetPosition}
                      onValueChange={setTargetPosition}
                    >
                      <SelectTrigger
                        className="flex-1 bg-background/50"
                        id="target-position"
                      >
                        <SelectValue placeholder="Sélectionnez un poste..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_POSITIONS.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {targetPosition === "Autre" && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1"
                      >
                        <Input
                          placeholder="Précisez le poste..."
                          value={customPosition}
                          onChange={(e) => setCustomPosition(e.target.value)}
                          className="bg-background/50"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* CV Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cv-content"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    Contenu de votre CV
                  </Label>
                  <Textarea
                    id="cv-content"
                    placeholder={`Collez ici le contenu de votre CV... Exemple :

AHMED BENALI
Développeur Full Stack | Algérie

EXPÉRIENCE
- Développeur Web chez TechDZ (2022-2024)
  Technologies: React, Node.js, PostgreSQL
  
FORMATION
- Master Informatique, Université d'Alger (2022)

COMPÉTENCES
- JavaScript, TypeScript, React, Node.js
- Python, Django
- Git, Docker, Linux`}
                    value={cvContent}
                    onChange={(e) => setCvContent(e.target.value)}
                    className="min-h-[280px] sm:min-h-[320px] text-sm leading-relaxed resize-y font-mono bg-background/50 border-border/50 focus-visible:border-primary/40 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{cvContent.length} caractères</span>
                    <span
                      className={
                        cvContent.length >= 50
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {cvContent.length >= 50
                        ? "✓ Prêt à analyser"
                        : `Minimum 50 caractères requis (${50 - cvContent.length} restants)`}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || cvContent.trim().length < 50}
                    className="flex-1 py-6 text-base font-semibold rounded-xl pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyse en cours.4 pt-4"
                    ):
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-primary via-primary/80 to-secondary h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground mb-1">
                            {progress}%
                          </div>
                          <p className="text-xs text-muted-foreground animate-pulse">
                            Analyse en cours... (jusqu'à 5 min)
                          </p>
                        </div>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                  </Button>
                  {(cvContent || result) && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="px-6 py-6 rounded-xl border-border/50 hover:bg-muted/50"
                      size="lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                  )}
                </div>

                {/* Loading Progress */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-6 border-t border-border/50 mt-6"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground mb-2">
                            {Math.round(progress)}%
                          </div>
                          <div className="text-sm text-muted-foreground animate-pulse">
                            🤖 Analyse IA en cours... (max 5 min)
                          </div>
                        </div>
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.section
              ref={resultsRef}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-primary/25 shadow-2xl shadow-primary/5 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/8 via-primary/4 to-primary/8 px-6 py-5 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block">Recommandations IA</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          Analyse personnalisée pour votre profil
                        </span>
                      </div>
                    </CardTitle>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-border/50 hover:bg-muted/50"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-1.5 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1.5" />
                      )}
                      {copied ? "Copié" : "Copier"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <div className="prose prose-sm sm:prose max-w-none prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                    {renderMarkdown(result)}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.section
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-6 flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">
                      Erreur
                    </h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-muted/50 border-border/50"
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Fonctionnalités
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Pourquoi utiliser CvOptimizer ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Notre outil IA est spécialement conçu pour le marché IT algérien
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Target,
                title: "Analyse Personnalisée",
                description:
                  "Recommandations adaptées à votre profil et au poste visé sur le marché algérien.",
                color:
                  "bg-emerald-500/15 text-emerald-400",
                glow: "group-hover:shadow-emerald-500/10",
              },
              {
                icon: TrendingUp,
                title: "Estimation Salariale",
                description:
                  "Fourchettes de salaires réalistes en DZD basées sur les tendances du marché IT en Algérie.",
                color:
                  "bg-teal-500/15 text-teal-400",
                glow: "group-hover:shadow-teal-500/10",
              },
              {
                icon: Award,
                title: "Compétences Recommandées",
                description:
                  "Identifiez les compétences techniques et soft skills les plus demandées par les employeurs algériens.",
                color:
                  "bg-amber-500/15 text-amber-400",
                glow: "group-hover:shadow-amber-500/10",
              },
              {
                icon: Briefcase,
                title: "Conseils Carrière",
                description:
                  "Stratégies et conseils pour maximiser vos chances de décrocher un poste IT en Algérie.",
                color:
                  "bg-violet-500/15 text-violet-400",
                glow: "group-hover:shadow-violet-500/10",
              },
              {
                icon: GraduationCap,
                title: "Certifications",
                description:
                  "Suggestions de certifications pertinentes pour booster votre profil sur le marché local.",
                color:
                  "bg-rose-500/15 text-rose-400",
                glow: "group-hover:shadow-rose-500/10",
              },
              {
                icon: MessageSquare,
                title: "Résumé Optimisé",
                description:
                  "Génération d'un résumé professionnel percutant adapté au marché IT algérien.",
                color:
                  "bg-sky-500/15 text-sky-400",
                glow: "group-hover:shadow-sky-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="group h-full border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 transition-shadow duration-300 ${feature.glow}`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ITTalentsdzpro CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl shadow-black/30">
              <div className="hero-gradient p-8 sm:p-10 relative noise-overlay">
                <div className="absolute inset-0">
                  <div className="orb-float absolute top-0 right-[10%] w-56 h-56 rounded-full bg-emerald-400/8 blur-3xl" />
                  <div className="orb-float-delayed absolute bottom-0 left-[5%] w-40 h-40 rounded-full bg-teal-400/6 blur-3xl" />
                </div>
                <div className="relative text-center">
                  <Badge
                    className="mb-4 bg-white/10 text-primary border-white/10 hover:bg-white/15 backdrop-blur-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Partenaire
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    ITTalentsdzpro.com
                  </h2>
                  <p className="text-white/60 max-w-xl mx-auto mb-6 leading-relaxed">
                    La référence des compétences IT en Algérie. Découvrez les
                    opportunités, formations et ressources pour développer votre
                    carrière dans le numérique.
                  </p>
                  <a
                    href="https://ittalentsdzpro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/85 text-primary-foreground font-semibold px-8 py-6 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 rounded-xl"
                    >
                      Visiter ITTalentsdzpro.com
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  CvOptimizer ITTalentsdzpro
                </p>
                <p className="text-xs text-muted-foreground">
                  Optimisez votre carrière IT en Algérie
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://ittalentsdzpro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                ITTalentsdzpro.com
              </a>
              <span className="text-xs text-muted-foreground">
                🇩🇿 Made in Algérie
              </span>
            </div>
          </div>

          <Separator className="my-6 bg-border/30" />

          <p className="text-center text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} CvOptimizer ITTalentsdzpro. Tous droits
            réservés. L&apos;analyse est fournie à titre indicatif.
          </p>
        </div>
      </footer>
    </div>
  );
}
