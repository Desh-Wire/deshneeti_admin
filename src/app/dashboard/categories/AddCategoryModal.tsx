'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addCategory } from './actions'; // Import the addCategory action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'; // For loading spinner

const AddCategoryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const categoryMutation = useMutation({
        mutationKey: ["addCategory"],
        mutationFn: addCategory,
        onSuccess: () => {
            setIsLoading(false);
            // Close the modal after adding the category
            onClose();
            // refresh the page
            window.location.reload();
        },
        onError: (error) => {
            setIsLoading(false);
            console.error(error);
        },
    });

    const handleCategorySubmit = async () => {
        setIsLoading(true);
        await categoryMutation.mutateAsync(categoryName);  // This should now match the expected types
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-4">Add Category</h2>

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
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Add Category"}
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

export default AddCategoryModal;
