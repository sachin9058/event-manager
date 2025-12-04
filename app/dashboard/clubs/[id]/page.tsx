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

type Club = {
    _id: string;
    name: string;
    description?: string;
    category: string;
    createdBy: {
        _id: string;
        clerkId: string;
        firstName?: string;
        lastName?: string;
        email: string;
        imageUrl?: string;
    };
    members: Array<{
        _id: string;
        clerkId: string;
        firstName?: string;
        lastName?: string;
        email: string;
        imageUrl?: string;
    }>;
    logo?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// Custom Button Components for Thematic Consistency
const PrimaryActionButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={`px-6 py-2 rounded-lg text-white text-sm font-medium uppercase tracking-wider disabled:opacity-40 transition-all duration-200 shadow-md hover:shadow-lg`}
        style={{ backgroundColor: secondaryColor }}
    >
        {children}
    </button>
);

const DangerButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={`px-4 py-1 rounded-md border text-red-600 text-xs disabled:opacity-40 hover:bg-red-50 transition-colors`}
        style={{ borderColor: primaryColor }}
    >
        {children}
    </button>
);


export default function ClubDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchClub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (club && isOwner()) {
            fetchInviteLink();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [club]);

    async function fetchClub() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/clubs/${id}`);
            if (!res.ok) throw new Error("Failed to fetch club");
            const data = await res.json();
            setClub(data.club);
        } catch (e: any) {
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    function isMember() {
        if (!user || !club) return false;
        return club.members.some(m => m.clerkId === user.id);
    }

    function isOwner() {
        if (!user || !club) return false;
        return club.createdBy.clerkId === user.id;
    }

    async function handleJoinLeave() {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }

        setActionLoading(true);
        try {
            const action = isMember() ? "leave" : "join";
            const res = await fetch(`/api/clubs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Action failed");
            }
            await fetchClub();
        } catch (e: any) {
            setError(e.message || "Unable to update membership");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRemoveMember(memberClerkId: string) {
        if (!confirm("Remove this member from the club?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/clubs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "remove", memberClerkId }), // Note: Changed to memberClerkId as it's more reliable client-side
            });
            if (!res.ok) throw new Error("Failed to remove member");
            await fetchClub();
        } catch (e: any) {
            setError(e.message || "Remove failed");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDeleteClub() {
        if (!confirm("Delete this club permanently? This action cannot be undone.")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/clubs/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Delete failed");
            }
            // navigate back to dashboard list
            router.push("/dashboard");
        } catch (e: any) {
            setError(e.message || "Delete failed");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleGenerateInviteLink() {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/clubs/${id}/invite`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to generate invite link");
            const data = await res.json();
            setInviteLink(data.inviteLink);
            setShowInviteModal(true);
        } catch (e: any) {
            setError(e.message || "Failed to generate invite link");
        } finally {
            setActionLoading(false);
        }
    }

    async function fetchInviteLink() {
        try {
            const res = await fetch(`/api/clubs/${id}/invite`);
            if (res.ok) {
                const data = await res.json();
                if (data.inviteLink) {
                    setInviteLink(data.inviteLink);
                }
            }
        } catch (e) {
            console.error("Failed to fetch invite link");
        }
    }

    function copyInviteLink() {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            alert("Invite link copied to clipboard!");
        }
    }

    if (loading) return <div className="p-12 text-lg" style={{ backgroundColor }}>Loading club data...</div>;
    if (!club) return <div className="p-12 text-lg" style={{ backgroundColor }}>Club not found.</div>;

    return (
        <main className="min-h-screen" style={{ backgroundColor: backgroundColor }}>
            <Navbar />
            
            <div className="p-6 md:p-12">
                <div className="max-w-5xl mx-auto">

                {/* Club Header Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-t-4 mb-8" style={{ borderColor: primaryColor }}>

                    <div className="flex justify-between items-start flex-wrap">
                        {/* Club Info */}
                        <div className="flex-grow min-w-[50%] mb-4 md:mb-0">
                            <h1 className={`text-4xl ${serifBold} mb-1`} style={{ color: primaryColor }}>{club.name}</h1>
                            <p className="text-sm text-gray-700 italic">{club.description || "No detailed mission statement provided."}</p>

                            <div className="mt-4 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-widest">
                                    Category: <span className="font-medium text-gray-700">{club.category}</span>
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                    Owner: <span className="font-medium text-gray-700">{isOwner() ? "You (Administrator)" : (club.createdBy.firstName + ' ' + club.createdBy.lastName || club.createdBy.email)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="text-right flex flex-col space-y-2">
                            {isOwner() && (
                                <PrimaryActionButton
                                    onClick={() => {
                                        if (inviteLink) {
                                            copyInviteLink();
                                        } else {
                                            handleGenerateInviteLink();
                                        }
                                    }}
                                    disabled={actionLoading}
                                >
                                    {inviteLink ? "📋 Copy Invite Link" : "🔗 Generate Invite Link"}
                                </PrimaryActionButton>
                            )}
                            <PrimaryActionButton
                                onClick={handleJoinLeave}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Processing…" : isMember() ? "Leave Club" : "Join Club"}
                            </PrimaryActionButton>
                            {isOwner() && (
                                <button
                                    onClick={handleDeleteClub}
                                    className="px-3 py-1 rounded-md border text-red-600 text-xs hover:bg-red-50 transition-colors"
                                    style={{ borderColor: primaryColor }}
                                    disabled={actionLoading}
                                >
                                    Delete Club
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Invite Link Modal */}
                {showInviteModal && inviteLink && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowInviteModal(false)}>
                        <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className={`text-2xl ${serifBold} mb-4`} style={{ color: primaryColor }}>Invite Link Generated</h3>
                            <p className="text-sm text-gray-600 mb-4">Share this link with members to join your club:</p>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                                <code className="text-sm break-all text-gray-800">{inviteLink}</code>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={copyInviteLink}
                                    className="px-6 py-2 rounded-lg text-white font-medium flex-1"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Section */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className={`text-2xl ${serifMedium} mb-4`} style={{ color: primaryColor }}>
                        Roster: Club Members ({club.members.length})
                    </h2>

                    {club.members.length === 0 ? (
                        <p className="text-lg text-gray-500 italic py-4">Be the first to join this organization!</p>
                    ) : (
                        <ul className="space-y-3">
                            {club.members.map((m) => (
                                <li key={m._id} className="flex items-center justify-between border-b border-gray-100 last:border-b-0 py-3 transition-colors hover:bg-gray-50 px-2 rounded-md">

                                    {/* Member Info */}
                                    <div className="flex items-center space-x-3">
                                        {/* Placeholder for Avatar */}
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                            {m.firstName ? m.firstName.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-gray-900">{m.firstName} {m.lastName}</p>
                                            <p className="text-xs text-gray-500">{m.email}</p>
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-4">
                                        {m.clerkId === club.createdBy.clerkId && <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: primaryColor }}>Owner</span>}
                                        {m.clerkId === user?.id && <span className="text-xs font-medium text-green-600 ml-2">You</span>}

                                        {isOwner() && m.clerkId !== club.createdBy.clerkId && (
                                            <DangerButton
                                                onClick={() => handleRemoveMember(m.clerkId)}
                                                disabled={actionLoading}
                                            >
                                                Remove
                                            </DangerButton>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {error && <p className="text-sm text-red-500 mt-4 p-4 border rounded-lg bg-red-50">{error}</p>}
                </div>
            </div>
        </main>
    );
}