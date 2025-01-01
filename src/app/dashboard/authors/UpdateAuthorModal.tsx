'use client';

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { updateAuthor, uploadAuthorImage } from "./actions";

interface UpdateAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: { name: string; photoUrl?: string, active: boolean }) => void;
    currentAuthor: { id: string; name: string; photoUrl?: string; email: string, fullPath?: string, active: boolean };
}

const UpdateAuthorModal = ({ isOpen, onClose, onUpdate, currentAuthor }: UpdateAuthorModalProps) => {
    const [name, setName] = useState(currentAuthor.name);
    const [file, setFile] = useState<File | null>(null);
    const [active, setActive] = useState<boolean>(currentAuthor.active);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let photoUrl = currentAuthor.photoUrl;
            let fullPath = currentAuthor.fullPath;

            if (file) {
                const response = await uploadAuthorImage({
                    file,
                    oldPhotoUrl: currentAuthor.photoUrl,
                    oldFullPath: currentAuthor.fullPath
                });

                photoUrl = response.publicUrl;
                fullPath = response.fullPath;
            }

            const updatedData = await updateAuthor({
                authorId: currentAuthor.id,
                authorName: name,
                email: currentAuthor.email,
                photoUrl: photoUrl ?? null,
                fullPath: fullPath ?? null,
                active: active,
            });

            onUpdate(updatedData);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Failed to update author:", error);
            alert("Error updating author.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Update Author</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                        <img
                            src={currentAuthor.photoUrl || '/default-avatar.png'}
                            alt={currentAuthor.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        />
                        <label className="block text-sm font-medium text-gray-700">Update Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active Author</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader className="animate-spin mr-2" size={16} /> : null}
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAuthorModal;