import Navbar from "~/component/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/component/ResumeCard";
import { resumes } from "../../constants";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumelyzing" },
    { name: "description", content: "Get Your Honest ATS AI feedback" },
  ];
}

export default function Home() {
      const {auth } = usePuterStore();
    const navigate = useNavigate(); 
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
  <Navbar></Navbar>
  <section className = "main-section">
  <div className="page-heading py-16">
<h1>Track Your Resume Application & Ratings</h1>
<h2>Review Your Submissions and Check AI-Powered FeedBacks</h2>
  </div>
 
{resumes.length > 0 && (
  <div className="resumes-section">
     {resumes.map((resume) => (
<ResumeCard key={resume.id} resume={resume}></ResumeCard>
      ))}
      </div>
)}

 </section>
  
 </main>

}
