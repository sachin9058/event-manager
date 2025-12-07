"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

// --- THEME DEFINITIONS ---
const primaryColor = '#70001A'; // Deep Maroon/Wine
const secondaryColor = '#C89446'; // Gold/Brass Accent
const backgroundColor = '#FAF9F8'; // Off-White/Cream
const serifBold = 'font-serif font-extrabold';
const serifMedium = 'font-serif font-medium';
// --- END THEME DEFINITIONS ---

type ClubInfo = {
    name: string;
    description?: string;
    category: string;
    logo?: string;
    memberCount: number;
    createdBy: {
        firstName?: string;
        lastName?: string;
        email: string;
    };
    createdAt: string;
};

export default function JoinClubPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();
    const { isLoaded, isSignedIn } = useUser();

    const [club, setClub] = useState<ClubInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (token) {
            fetchClubInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    async function fetchClubInfo() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/clubs/join/${token}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Invalid invite link");
            }
            const data = await res.json();
            setClub(data.club);
        } catch (e: any) {
            setError(e.message || "Failed to load club information");
        } finally {
            setLoading(false);
        }
    }

    async function handleJoinClub() {
        if (!isSignedIn) {
            alert("Please sign in to join this club");
            return;
        }

        setJoining(true);
        setError(null);
        try {
            const res = await fetch(`/api/clubs/join/${token}`, {
                method: "POST",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to join club");
            }
            const data = await res.json();
            setSuccess(true);
            
            // Redirect to club page after 2 seconds
            setTimeout(() => {
                router.push(`/dashboard/clubs/${data.clubId}`);
            }, 2000);
        } catch (e: any) {
            setError(e.message || "Failed to join club");
        } finally {
            setJoining(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen" style={{ backgroundColor }}>
                <Navbar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <p className="text-xl text-gray-600">Loading club information...</p>
                </div>
            </main>
        );
    }

    if (error && !club) {
        return (
            <main className="min-h-screen" style={{ backgroundColor }}>
                <Navbar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="text-center max-w-md mx-4">
                        <h1 className={`text-3xl ${serifBold} mb-4`} style={{ color: primaryColor }}>
                            Invalid Invite Link
                        </h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-6 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: secondaryColor }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="min-h-screen" style={{ backgroundColor }}>
                <Navbar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="text-center max-w-md mx-4">
                        <h1 className={`text-4xl ${serifBold} mb-4`} style={{ color: secondaryColor }}>
                            🎉 Welcome!
                        </h1>
                        <p className="text-xl text-gray-700 mb-2">You&apos;ve successfully joined</p>
                        <p className={`text-2xl ${serifMedium} mb-6`} style={{ color: primaryColor }}>
                            {club?.name}
                        </p>
                        <p className="text-gray-600">Redirecting to club page...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen" style={{ backgroundColor }}>
            <Navbar />
            
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4" style={{ borderColor: primaryColor }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl ${serifBold} mb-2`} style={{ color: primaryColor }}>
                            You&apos;re Invited!
                        </h1>
                        <p className="text-gray-600">Join this club and become part of the community</p>
                    </div>

                    {/* Club Information */}
                    {club && (
                        <div className="space-y-6 mb-8">
                            <div className="text-center border-b pb-6">
                                <h2 className={`text-3xl ${serifMedium} mb-3`} style={{ color: primaryColor }}>
                                    {club.name}
                                </h2>
                                <p className="text-gray-700 italic mb-4">
                                    {club.description || "No description provided"}
                                </p>
                                <div className="flex justify-center gap-4 text-sm text-gray-600">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        📁 {club.category}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        👥 {club.memberCount} {club.memberCount === 1 ? 'Member' : 'Members'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Created by:</span>{" "}
                                    {club.createdBy.firstName && club.createdBy.lastName
                                        ? `${club.createdBy.firstName} ${club.createdBy.lastName}`
                                        : club.createdBy.email}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(club.createdAt).toLocaleDateString('en-GB')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {isLoaded && isSignedIn ? (
                            <>
                                <button
                                    onClick={handleJoinClub}
                                    disabled={joining}
                                    className="flex-1 px-6 py-3 rounded-lg text-white font-medium text-lg disabled:opacity-50"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    {joining ? "Joining..." : "Join Club"}
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <div className="text-center w-full">
                                <p className="text-gray-600 mb-4">Please sign in to join this club</p>
                                <button
                                    onClick={() => router.push("/sign-in")}
                                    className="px-6 py-3 rounded-lg text-white font-medium"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
