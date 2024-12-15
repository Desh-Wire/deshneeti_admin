'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesStats } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddCategoryModal from "./AddCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { Edit3 } from "lucide-react"; // Import the edit icon

const Categories = () => {
  const { user, loading } = useProtectedRoute();
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    _count: {
      newsItems: number;
    };
    id: string
  }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesStats,
    retry: true,
    retryDelay: 500,
    enabled: !!user,
  });

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#ece2c8]">
        <span className="loader"></span>
      </div>
    );
  }

  if (!user) {
    router.push("/error");
    return null;
  }

  const handleUpdateClick = (category: {
    name: string;
    _count: {
      newsItems: number;
    };
    id: string
  }) => {
    setSelectedCategory(category);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#ece2c8] p-6">
        <main className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">
            Categories Overview
          </h2>

          {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <div className="text-center mb-6">
              <button
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Category
              </button>
            </div>
          )}

          <div className="mt-8">
            {error ? (
              <p className="text-red-500 text-center">
                Failed to load categories: {error.message}
              </p>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Total Categories: {data?.totalCategories || 0}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {data?.categories.map((category) => (
                    <div
                      key={category.id}
                      className="relative p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                    >
                      {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                        <Edit3
                          className="absolute top-2 right-2 w-5 h-5 text-gray-600 cursor-pointer hover:text-red-600 "
                          onClick={() => handleUpdateClick(category)}
                        />
                      )}
                      <span className="text-3xl font-extrabold text-gray-800">{category.name}</span>
                      <p className="mt-2 text-gray-600">Total News Items: {category._count.newsItems}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {selectedCategory && (
        <UpdateCategoryModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          categoryId={selectedCategory.id}
          initialCategoryName={selectedCategory.name}
        />
      )}
    </>
  );
};

export default Categories;
