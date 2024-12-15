
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateCategory } from './actions'; // Import the updateCategory action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'; // For loading spinner

const UpdateCategoryModal = ({ isOpen, onClose, categoryId, initialCategoryName }: { isOpen: boolean, onClose: () => void, categoryId: string, initialCategoryName: string }) => {
    const [categoryName, setCategoryName] = useState(initialCategoryName);
    const [isLoading, setIsLoading] = useState(false);

    // Use the correct type for mutation here
    const categoryMutation = useMutation({
        mutationKey: ["updateCategory"],
        mutationFn: updateCategory,
        onSuccess: () => {
            setIsLoading(false);
            // Close the modal after updating the category
            onClose();
            // Refresh the page
            window.location.reload();
        },
        onError: (error) => {
            setIsLoading(false);
            console.error(error);
        },
    });

    const handleCategorySubmit = async () => {
        if (!categoryId || !categoryName.trim()) {
            console.error("Invalid categoryId or categoryName.");
            return;
        }

        setIsLoading(true);
        await categoryMutation.mutateAsync({ categoryId, categoryName });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-4">Update Category</h2>

                    {/* Category Form */}
                    <div className="mb-4 flex flex-col items-center">
                        <Input
                            type="text"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={handleCategorySubmit} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Update Category"}
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UpdateCategoryModal;
