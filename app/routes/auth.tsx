import React, { useEffect, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
export const meta: () => Array<{ title?: string; name?: string; content?: string }> = () => [
    { title: "Resumlyzer | Auth | " },
    { name: "description", content: "log into your account" },
];

const Auth: () => JSX.Element = () => {
    const { isLoading , auth } = usePuterStore();
    const Location = useLocation();
    const next = Location.search.split("next=")[1];
    const navigate = useNavigate(); 
    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated , next]);
    return (
<main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
<div className="gradint-border shadow-lg">
    <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
        <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log in for Making Your Job Dream Come True</h2>
        </div>
        <div>
            {isLoading ? (
                <button className="auth-button animate-pulse">
                    <p>We Are Signing You in</p>
                </button>
            ) : (
                <>
                {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                        <p>Log Out</p>
                    </button>) : (
                         <button className="auth-button" onClick={auth.signIn}>
                        <p>Log In</p>
                    </button>
                    )}
                </>
            )}
        </div>
    </section>
</div>
</main>
    )
}
export default Auth;