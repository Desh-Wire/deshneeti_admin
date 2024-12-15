'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'; // For loading spinner
import { addAuthor } from './actions';

const AddAuthorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [authorName, setAuthorName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const authorMutation = useMutation({
        mutationKey: ["addAuthor"],
        mutationFn: addAuthor,
        onSuccess: () => {
            setIsLoading(false);
            // Close the modal after adding the author
            onClose();
            // refresh the page
            window.location.reload();
        },
        onError: (error) => {
            setIsLoading(false);
            console.error(error);
        },
    });

    const handleAuthorSubmit = async () => {
        setIsLoading(true);
        await authorMutation.mutateAsync({ authorName, photoUrl });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-4">Add Author</h2>

                    {/* Author Form */}
                    <div className="mb-4 flex flex-col items-center">
                        <Input
                            type="text"
                            placeholder="Author Name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            type="text"
                            placeholder="Photo URL (Optional)"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={handleAuthorSubmit} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Add Author"}
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

export default AddAuthorModal;
