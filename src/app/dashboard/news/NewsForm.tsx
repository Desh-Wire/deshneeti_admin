'use client';

import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X } from "lucide-react";

interface NewsFormData {
    heading: string;
    tagLine: string;
    pictureUrl: string;
    content: string;
    authorId: string;
    categoryId: string;
    tags: string;
    readTime: string;
}

const NewsForm = () => {
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<NewsFormData>({
        defaultValues: {
            heading: "",
            tagLine: "",
            pictureUrl: "",
            content: "",
            authorId: "",
            categoryId: "",
            tags: "",
            readTime: "",
        }
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            // Here you would typically upload the file to your server
            // and set the pictureUrl field with the returned URL
            form.setValue("pictureUrl", file.name); // Temporary, replace with actual URL after upload
        }
    }, [form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1,
        multiple: false
    });

    const removeImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        form.setValue("pictureUrl", "");
    };

    const onSubmit = (data: NewsFormData) => {
        const formattedData = {
            ...data,
            tags: data.tags.split(",").map((tag: string) => tag.trim()),
            readTime: parseInt(data.readTime, 10),
        };
        console.log("Submitted News Data:", formattedData);
    };

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6 flex items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl space-y-6"
                >
                    <h2 className="text-3xl font-bold text-black text-center">Publish News</h2>

                    {/* Image Upload */}
                    <FormField
                        control={form.control}
                        name="pictureUrl"
                        rules={{ required: "Image is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image Upload</FormLabel>
                                <FormControl>
                                    <div className="w-full">
                                        {!preview ? (
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
                                                    ${isDragActive
                                                        ? "border-primary bg-primary/10"
                                                        : "border-gray-300 hover:border-primary"
                                                    }`}
                                            >
                                                <input {...getInputProps()} />
                                                <div className="flex flex-col items-center justify-center space-y-2 text-sm text-gray-600">
                                                    {
                                                        isDragActive ? (
                                                            <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l6 6m0 0l6-6m-6 6V3" />
                                                            </svg>
                                                        ) : (
                                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                                        )
                                                    }
                                                    <p className="text-center">
                                                        {isDragActive
                                                            ? "Drop the image here"
                                                            : "Drag & drop an image here, or click to select"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Supports: JPG, JPEG, PNG, GIF
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Heading */}
                    <FormField
                        control={form.control}
                        name="heading"
                        rules={{ required: "Heading is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Heading</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter news heading" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tagline */}
                    <FormField
                        control={form.control}
                        name="tagLine"
                        rules={{ required: "Tagline is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tagline</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter news tagline" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Picture URL */}
                    <FormField
                        control={form.control}
                        name="pictureUrl"
                        rules={{
                            required: "Picture URL is required",
                            pattern: {
                                value: /^(https?:\/\/)?.+/i,
                                message: "Please enter a valid URL"
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Picture URL</FormLabel>
                                <FormControl>
                                    <Input type="url" placeholder="Enter picture URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Content */}
                    <FormField
                        control={form.control}
                        name="content"
                        rules={{
                            required: "Content is required",
                            minLength: {
                                value: 50,
                                message: "Content should be at least 50 characters long"
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter news content"
                                        className="h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author ID */}
                    <FormField
                        control={form.control}
                        name="authorId"
                        rules={{ required: "Author ID is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter author ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category ID */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        rules={{ required: "Category ID is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter category ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tags */}
                    <FormField
                        control={form.control}
                        name="tags"
                        rules={{
                            required: "Tags are required",
                            pattern: {
                                value: /^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/,
                                message: "Please enter comma-separated tags"
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter tags (comma-separated)" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter tags separated by commas (e.g., news,tech,update)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Read Time */}
                    <FormField
                        control={form.control}
                        name="readTime"
                        rules={{
                            required: "Read time is required",
                            min: {
                                value: 1,
                                message: "Read time must be at least 1 minute"
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Read Time (in minutes)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter read time"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default NewsForm;