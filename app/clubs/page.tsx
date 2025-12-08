"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loader, { CardSkeleton } from "@/components/Loader";

// Theme colors
const primaryColor = '#70001A';
const secondaryColor = '#C89446';
const backgroundColor = '#FAF9F8';
const serifBold = 'font-serif font-extrabold';
const serifMedium = 'font-serif font-medium';

type Club = {
    _id: string;
    name: string;
    description?: string;
    category: string;
    createdBy: {
        _id: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
    members: any[];
    logo?: string;
    isActive?: boolean;
    createdAt?: string;
};

export default function AllClubsPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Cultural", "Technical", "Sports", "Academic", "Social", "Other"];

    useEffect(() => {
        fetchAllClubs();
    }, []);

    async function fetchAllClubs() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/clubs/all");
            if (!res.ok) throw new Error("Failed to fetch clubs");
            const data = await res.json();
            setClubs(data.clubs || []);
        } catch (e: any) {
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             club.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
        return matchesSearch && matchesCategory && club.isActive;
    });

    if (loading) {
        return (
            <main className="min-h-screen" style={{ backgroundColor }}>
                <Navbar />
                <div className="p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <div className="h-12 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen" style={{ backgroundColor }}>
            <Navbar />
            
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-5xl ${serifBold} mb-4`} style={{ color: primaryColor }}>
                        All Clubs
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover and join clubs that match your interests
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search clubs by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50 focus:outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-gray-600 mt-4">
                        Showing {filteredClubs.length} of {clubs.length} clubs
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">Loading clubs...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchAllClubs}
                                className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
                                style={{ backgroundColor: secondaryColor }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Clubs Grid */}
                {!loading && !error && (
                    <>
                        {filteredClubs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600">No clubs found</p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-4 text-sm underline"
                                        style={{ color: primaryColor }}
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {filteredClubs.map((club) => (
                                    <div
                                        key={club._id}
                                        onClick={() => router.push(`/dashboard/clubs/${club._id}`)}
                                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-t-4"
                                        style={{ borderColor: secondaryColor }}
                                    >
                                        {/* Club Header */}
                                        <div className="mb-4">
                                            <h3 className={`text-2xl ${serifMedium} mb-2`} style={{ color: primaryColor }}>
                                                {club.name}
                                            </h3>
                                            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: secondaryColor }}>
                                                {club.category}
                                            </span>
                                        </div>

                                        {/* Club Description */}
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {club.description || "No description provided"}
                                        </p>

                                        {/* Club Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>{club.members.length} members</span>
                                            </div>
                                            <div className="text-xs">
                                                {club.createdBy.firstName && club.createdBy.lastName 
                                                    ? `${club.createdBy.firstName} ${club.createdBy.lastName}`
                                                    : club.createdBy.email}
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                            className="w-full mt-4 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                                            style={{ borderColor: primaryColor, color: primaryColor }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/dashboard/clubs/${club._id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
