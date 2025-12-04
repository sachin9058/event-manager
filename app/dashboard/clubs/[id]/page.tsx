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
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [certificateForm, setCertificateForm] = useState({
        eventName: '',
        eventDate: '',
        collegeName: '',
        position: 'Participant',
        selectedMembers: [] as string[],
    });
    const [certificateResults, setCertificateResults] = useState<any>(null);

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

    async function handleGenerateCertificates() {
        if (!certificateForm.eventName || !certificateForm.eventDate || !certificateForm.collegeName) {
            alert("Please fill in all required fields");
            return;
        }

        setActionLoading(true);
        setError(null);
        setCertificateResults(null);

        try {
            const payload = {
                eventName: certificateForm.eventName,
                eventDate: certificateForm.eventDate,
                collegeName: certificateForm.collegeName,
                position: certificateForm.position,
                memberIds: certificateForm.selectedMembers.length > 0 ? certificateForm.selectedMembers : undefined,
            };

            const res = await fetch(`/api/clubs/${id}/certificates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to generate certificates");
            }

            const data = await res.json();
            setCertificateResults(data.results);
            alert(`Certificates sent! Success: ${data.results.success}, Failed: ${data.results.failed}`);
        } catch (e: any) {
            setError(e.message || "Failed to generate certificates");
        } finally {
            setActionLoading(false);
        }
    }

    function toggleMemberSelection(memberId: string) {
        setCertificateForm(prev => ({
            ...prev,
            selectedMembers: prev.selectedMembers.includes(memberId)
                ? prev.selectedMembers.filter(id => id !== memberId)
                : [...prev.selectedMembers, memberId]
        }));
    }

    function selectAllMembers() {
        if (!club) return;
        setCertificateForm(prev => ({
            ...prev,
            selectedMembers: club.members.map(m => m._id)
        }));
    }

    function deselectAllMembers() {
        setCertificateForm(prev => ({
            ...prev,
            selectedMembers: []
        }));
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
                        <div className="grow min-w-[50%] mb-4 md:mb-0">
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
                                <>
                                    <PrimaryActionButton
                                        onClick={() => setShowCertificateModal(true)}
                                        disabled={actionLoading || club.members.length === 0}
                                    >
                                        📜 Generate Certificates
                                    </PrimaryActionButton>
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
                                </>
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

                {/* Certificate Generation Modal */}
                {showCertificateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowCertificateModal(false)}>
                        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className={`text-2xl ${serifBold} mb-6`} style={{ color: primaryColor }}>Generate Certificates</h3>
                            
                            {/* Form */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                                    <input
                                        type="text"
                                        value={certificateForm.eventName}
                                        onChange={(e) => setCertificateForm({ ...certificateForm, eventName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                                        placeholder="e.g., Annual Tech Fest 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                                    <input
                                        type="date"
                                        value={certificateForm.eventDate}
                                        onChange={(e) => setCertificateForm({ ...certificateForm, eventDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name *</label>
                                    <input
                                        type="text"
                                        value={certificateForm.collegeName}
                                        onChange={(e) => setCertificateForm({ ...certificateForm, collegeName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                                        placeholder="e.g., ABC University"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position/Role</label>
                                    <select
                                        value={certificateForm.position}
                                        onChange={(e) => setCertificateForm({ ...certificateForm, position: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                                    >
                                        <option value="Participant">Participant</option>
                                        <option value="Winner">Winner</option>
                                        <option value="Runner-up">Runner-up</option>
                                        <option value="Organizer">Organizer</option>
                                        <option value="Volunteer">Volunteer</option>
                                        <option value="Speaker">Speaker</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Members</label>
                                    <div className="flex gap-2 mb-2">
                                        <button
                                            onClick={selectAllMembers}
                                            className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                                            type="button"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={deselectAllMembers}
                                            className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                                            type="button"
                                        >
                                            Deselect All
                                        </button>
                                        <span className="text-sm text-gray-600 ml-auto self-center">
                                            {certificateForm.selectedMembers.length} of {club?.members.length} selected
                                        </span>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                                        {club?.members.map(m => (
                                            <label key={m._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={certificateForm.selectedMembers.includes(m._id)}
                                                    onChange={() => toggleMemberSelection(m._id)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">
                                                    {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : m.email}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Leave unselected to send certificates to all members
                                    </p>
                                </div>
                            </div>

                            {/* Results */}
                            {certificateResults && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Results</h4>
                                    <p className="text-sm text-blue-800">
                                        ✅ Successfully sent: {certificateResults.success}<br />
                                        ❌ Failed: {certificateResults.failed}<br />
                                        📧 Total: {certificateResults.total}
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleGenerateCertificates}
                                    disabled={actionLoading}
                                    className="px-6 py-2 rounded-lg text-white font-medium flex-1 disabled:opacity-50"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    {actionLoading ? "Generating & Sending..." : "Generate & Send Certificates"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCertificateModal(false);
                                        setCertificateResults(null);
                                        setError(null);
                                    }}
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