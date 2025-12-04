"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Club = {
    _id?: string;
    name: string;
    description?: string;
    category: string;
    createdBy?: any;
    members?: any[];
    logo?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// Define theme colors for easy access
const primaryColor = '#70001A'; // Deep Maroon
const secondaryColor = '#C89446'; // Gold/Brass
const backgroundColor = '#FAF9F8'; // Off-White/Cream
const serifBold = 'font-serif font-extrabold';
const serifMedium = 'font-serif font-medium';

export default function ClubsDashboard() {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editing, setEditing] = useState<null | Club>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) return;
        fetchClubs();
    }, [isLoaded, isSignedIn]);

    async function fetchClubs() {
        setLoading(true);
        try {
            const res = await fetch("/api/clubs");
            if (!res.ok) throw new Error("Failed to fetch clubs");
            const data = await res.json();
            setClubs(Array.isArray(data) ? data : data.clubs || []);
        } catch (e: any) {
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateOrUpdate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        if (!user) return;
        setCreating(true);
        setError(null);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                category: "Other",
            };

            const url = editing ? `/api/clubs/${editing._id}` : "/api/clubs";
            const method = editing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const body = await res.text();
                throw new Error(body || "Failed to save club");
            }

            await fetchClubs();
            setForm({ name: "", description: "" });
            setEditing(null);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id?: string) {
        if (!id) return;
        if (!confirm("Delete this club?")) return;
        try {
            const res = await fetch(`/api/clubs/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setClubs((prev) => prev.filter((c) => c._id !== id));
        } catch (e: any) {
            alert(e.message || "Delete failed");
        }
    }

    function startEdit(c: Club) {
        setEditing(c);
        setForm({ name: c.name, description: c.description || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Custom button styling for the primary action (Create/Update)
    const PrimaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button
            {...props}
            className={`px-6 py-2 rounded-lg text-white disabled:opacity-40 transition-shadow duration-200 shadow-md hover:shadow-lg`}
            style={{ backgroundColor: secondaryColor }}
        >
            {children}
        </button>
    );

    // Custom button styling for secondary actions (Edit/Cancel)
    const SecondaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button
            {...props}
            className={`px-4 py-2 rounded-lg border text-gray-700 hover:text-gray-900 transition-colors duration-200`}
            style={{ borderColor: secondaryColor }}
        >
            {children}
        </button>
    );

    return (
        <main className="min-h-screen" style={{ backgroundColor: backgroundColor }}>
            <Navbar />
            
            <div className="p-6 md:p-12">
                <div className="max-w-6xl mx-auto">

                    <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-300">
                        <div>
                            <h1 className={`text-4xl ${serifBold} tracking-wide`} style={{ color: primaryColor }}>
                                Club Management 🏛️
                            </h1>
                            {isLoaded && isSignedIn && user ? (
                                <p className="text-sm text-gray-700 mt-1">
                                    Signed in as <span className="font-medium" style={{ color: primaryColor }}>{user.username || user.firstName || user.primaryEmailAddress?.emailAddress}</span>
                                </p>
                        ) : (
                            <p className="text-sm text-red-500">Please sign in to manage clubs.</p>
                        )}
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs uppercase tracking-widest text-gray-500">Fest Architects Client Portal</p>
                    </div>
                </header>

                {/* --- Create/Edit Form Section --- */}
                <section className="mb-10 bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-4" style={{ borderColor: secondaryColor }}>
                    <h2 className={`text-2xl ${serifMedium} mb-4`} style={{ color: primaryColor }}>{editing ? "Edit Club Details" : "Establish a New Club"}</h2>

                    <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Club Name (Required)</label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                                className="mt-1 w-full rounded-lg border border-gray-300 focus:border-gray-500 px-4 py-2 transition-shadow duration-200"
                                placeholder="The Academic Honors Society"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Mission/Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                                className="mt-1 w-full rounded-lg border border-gray-300 focus:border-gray-500 px-4 py-2 transition-shadow duration-200"
                                placeholder="A brief summary of your club's goals and activities."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <PrimaryButton type="submit" disabled={!isSignedIn || creating}>
                                {creating ? (editing ? "UPDATING..." : "ESTABLISHING...") : editing ? "Update Club" : "Establish Club"}
                            </PrimaryButton>
                            {editing && (
                                <SecondaryButton type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "" }); }}>Cancel</SecondaryButton>
                            )}
                            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                        </div>
                    </form>
                </section>

                {/* --- Clubs Listing Section --- */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-xl">
                    <h2 className={`text-2xl ${serifMedium} mb-5`} style={{ color: primaryColor }}>Clubs You Manage</h2>

                    {loading ? (
                        <p className="text-sm text-gray-500">Loading club roster...</p>
                    ) : clubs.length === 0 ? (
                        <p className="text-lg text-gray-600 italic py-4">No clubs found. Use the section above to establish your first organization.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clubs.map((c) => (
                                <article
                                    key={c._id}
                                    className="border rounded-xl p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer"
                                    style={{ borderColor: primaryColor, borderLeftWidth: '6px' }}
                                    onClick={() => router.push(`/dashboard/clubs/${c._id}`)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className={`text-xl ${serifMedium} tracking-wide`} style={{ color: primaryColor }}>{c.name}</h3>
                                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">{c.description || <span className='italic text-gray-500'>No detailed mission provided.</span>}</p>
                                            <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider">Owner: {c.createdBy?.clerkId === user?.id ? "You (Administrator)" : (c.createdBy?.firstName + ' ' + c.createdBy?.lastName || 'Unknown')}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 mt-1 ml-4" onClick={(e) => e.stopPropagation()}>
                                            <SecondaryButton onClick={() => startEdit(c)} className="text-sm">Edit</SecondaryButton>
                                            <button onClick={() => handleDelete(c._id)} className="px-2 py-1 rounded-lg border border-red-300 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                </div>
            </div>
        </main>
    );
}