import Navbar from "~/component/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/component/ResumeCard";
import { resumes } from "../../constants";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useMemo } from "react";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumelyzing" },
    { name: "description", content: "Get Your Honest ATS AI feedback" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  const stats = useMemo(() => {
    if (!resumes || resumes.length === 0) {
      return { total: 0, avgScore: 0, avgATS: 0, bestScore: 0 };
    }
    const total = resumes.length;
    const sumScore = resumes.reduce((sum, r) => sum + (r.feedback?.overallScore ?? 0), 0);
    const sumATS = resumes.reduce((sum, r) => sum + (r.feedback?.ATS?.score ?? 0), 0);
    const bestScore = Math.max(...resumes.map((r) => r.feedback?.overallScore ?? 0));
    return {
      total,
      avgScore: Math.round(sumScore / total),
      avgATS: Math.round(sumATS / total),
      bestScore,
    };
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar></Navbar>
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Resume Application & Ratings</h1>
          <h2>Review Your Submissions and Check AI-Powered FeedBacks</h2>
        </div>

        {resumes.length > 0 && (
          <>
            <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Total Resumes</div>
                <div className="text-2xl font-semibold">{stats.total}</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Average Score</div>
                <div className="text-2xl font-semibold">{stats.avgScore}/100</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Average ATS</div>
                <div className="text-2xl font-semibold">{stats.avgATS}/100</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Best Score</div>
                <div className="text-2xl font-semibold">{stats.bestScore}/100</div>
              </div>
            </div>

            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume}></ResumeCard>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
