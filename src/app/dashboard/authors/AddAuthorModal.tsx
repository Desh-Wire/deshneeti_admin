'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { addAuthor, uploadAuthorImage } from './actions';
import { createClient } from '@/utils/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AddAuthorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [authorName, setAuthorName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [status, setStatus] = useState<"idle" | "uploading" | "creating" | "success" | "error">("idle");

    // Initialize email on mount
    useEffect(() => {
        const getEmail = async () => {
            try {
                const supabase = createClient();
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (user?.email) setEmail(user.email);
            } catch (error) {
                console.error('Error fetching user email:', error);
                setUploadError('Error fetching user email');
            }
        };

        if (isOpen) {
            getEmail();
        }
    }, [isOpen]);

    const uploadMutation = useMutation({
        mutationFn: uploadAuthorImage,
        onError: (error) => {
            setStatus("error");
            setUploadError(error instanceof Error ? error.message : "Image upload failed");
        },
    });


    const addMutation = useMutation({
        mutationFn: addAuthor,
        onSuccess: () => {
            setStatus("success");
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        },
        onError: (error) => {
            setStatus("error");
            setUploadError(error instanceof Error ? error.message : "Failed to create author");
        },
    });


    const handleSubmit = async () => {
        try {
            setUploadError("");

            if (!authorName.trim()) {
                setUploadError("Please enter an author name");
                return;
            }

            if (!email) {
                setUploadError("Email is required");
                return;
            }

            setStatus("uploading");

            let photoUrl = "";
            let fullPath = "";
            if (file) {
                const response = await uploadMutation.mutateAsync({ file });
                photoUrl = response.publicUrl; // Ensure uploadAuthorImage returns the URL
                fullPath = response.fullPath;
            }

            setStatus("creating");

            await addMutation.mutateAsync({
                authorName: authorName.trim(),
                email,
                photoUrl,
                fullPath: fullPath || "",
            });
        } catch (error) {
            setStatus("error");
            setUploadError("Something went wrong");
        }
    };


    // Reset form function
    const resetForm = () => {
        setAuthorName("");
        setEmail("");
        setFile(null);
        setUploadError("");
        setStatus("idle");
    };

    // Handle close
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (file: File) => {
        setUploadError("");

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            setUploadError("Please upload an image file");
            return;
        }

        // Check file size (500KB limit)
        if (file.size > 500 * 1024) {
            setUploadError("File size must be less than 500KB");
            return;
        }

        setFile(file);
    };

    // ... rest of your component code (dropzone, file handling, etc.) ...

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Add Author</h2>

                <div className="mb-4 flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Author Name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        disabled={status !== "idle"}
                    />

                    <Input
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-100"
                    />

                    {/* Dropzone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                            ${status !== "idle" ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileInput}
                            accept="image/*"
                            disabled={status !== "idle"}
                        />

                        {file ? (
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm">{file.name}</span>
                                {status === "idle" && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-6 w-6 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    Drag and drop or click to upload image
                                </p>
                                <p className="text-xs text-gray-400">
                                    Maximum file size: 500KB
                                </p>
                            </div>
                        )}
                    </div>

                    {uploadError && (
                        <Alert variant="destructive">
                            <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={status !== "idle" || !authorName.trim() || !email}
                        >
                            {status !== "idle" && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                            Create Author
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={status === "uploading" || status === "creating"}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default AddAuthorModal;