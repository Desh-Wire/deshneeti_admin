'use client';

import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getAuthors } from "./actions";
import { User } from "@supabase/supabase-js";
import Select from 'react-select';

interface NewsFormData {
    pictureUrl: string;
    authorId: string;
    categoryId: string;
    tags: string;
    readTime: string;
    heading_en: string;
    tagLine_en: string;
    content_en: string;
    heading_hi: string;
    tagLine_hi: string;
    content_hi: string;
    heading_ur: string;
    tagLine_ur: string;
    content_ur: string;
}


const customStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: '#d1d5db',
        borderRadius: '0.375rem',
        '&:hover': {
            borderColor: '#3b82f6',
        },
        boxShadow: 'none',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#e0f2fe' : '#fff',
        color: '#111827',
    }),
};

const NewsForm = ({ user }: { user: User }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<NewsFormData>({
        defaultValues: {
            pictureUrl: "",
            authorId: "",
            categoryId: "",
            tags: "",
            readTime: "",
            heading_en: "",
            tagLine_en: "",
            content_en: "",
            heading_hi: "",
            tagLine_hi: "",
            content_hi: "",
            heading_ur: "",
            tagLine_ur: "",
            content_ur: "",
        }
    });

    const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        retry: true,
        retryDelay: 500,
        enabled: !!user,
    });

    const { data: authorData, isLoading: authorLoading, error: authorError } = useQuery({
        queryKey: ["authors"],
        queryFn: getAuthors,
        retry: true,
        retryDelay: 500,
        enabled: !!user,
    });

    useEffect(() => {
        if (categoryData && authorData) {
            setLoading(false);
        }
    }, [categoryData, authorData]);

    useEffect(() => {
        if (categoryError || authorError) {
            setError("Failed to fetch categories and authors");
        }
    }, [categoryError, authorError]);

    // useEffect(() => {
    //     console.log(form.getValues());
    // }, [form.watch()]);


    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            form.setValue("pictureUrl", file.name);
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

    const languageFields = (lang: 'en' | 'hi' | 'ur', labelPrefix: string) => (
        <div className="space-y-4 border p-4 rounded-md mb-4">
            <h4 className="text-lg font-semibold text-gray-700">{labelPrefix}</h4>
            <FormField
                control={form.control}
                name={`heading_${lang}`}
                rules={{ required: `${labelPrefix} Heading is required` }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold">Heading</FormLabel>
                        <FormControl>
                            <Input placeholder={`Enter ${labelPrefix} heading`} className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`tagLine_${lang}`}
                rules={{ required: `${labelPrefix} Tagline is required` }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold">Tagline</FormLabel>
                        <FormControl>
                            <Input placeholder={`Enter ${labelPrefix} tagline`} className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`content_${lang}`}
                rules={{ required: `${labelPrefix} Content is required`, minLength: { value: 50, message: `${labelPrefix} Content should be at least 50 characters long` } }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold">Content</FormLabel>
                        <FormControl>
                            <Textarea placeholder={`Enter ${labelPrefix} content`} className="min-h-[200px] border-gray-300 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Main Content Section */}
                <div className="space-y-4">
                    {/* Image Upload */}
                    <FormField
                        control={form.control}
                        name="pictureUrl"
                        rules={{ required: "Image is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Featured Image</FormLabel>
                                <FormControl>
                                    <div className="w-full">
                                        {!preview ? (
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors
                                                    ${isDragActive
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <input {...getInputProps()} />
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <ImageIcon className="h-10 w-10 text-gray-400" />
                                                    <p className="text-sm font-medium text-gray-600">
                                                        {isDragActive
                                                            ? "Drop the image here"
                                                            : "Drag & drop an image here, or click to select"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Supports: JPG, JPEG, PNG (Max size: 500KB)
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-lg overflow-hidden">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-56 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
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

                    {/* Language Sections */}
                    {languageFields("en", "English")}
                    {languageFields("hi", "Hindi")}
                    {languageFields("ur", "Urdu")}

                    <Separator className="my-6" />

                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Article Metadata</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Author ID */}
                            <FormField
                                control={form.control}
                                name="authorId"
                                rules={{ required: "Author ID is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Author</FormLabel>
                                        <FormControl>
                                            <Select
                                                styles={customStyles}
                                                options={authorData?.map((author: { id: string; name: string }) => ({
                                                    value: author.id,
                                                    label: author.name
                                                }))}
                                                placeholder="Select an author"
                                                onChange={(selectedOption: any) => field.onChange(selectedOption?.value)}
                                            />
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
                                        <FormLabel className="text-sm font-semibold">Category</FormLabel>
                                        <FormControl>
                                            <Select
                                                styles={customStyles}
                                                options={categoryData?.map((category: { id: string; name: string }) => ({
                                                    value: category.id,
                                                    label: category.name
                                                }))}
                                                placeholder="Select a category"
                                                onChange={(selectedOption: any) => field.onChange(selectedOption?.value)}
                                            />
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
                                        <FormLabel className="text-sm font-semibold">Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="news, tech, update"
                                                className="border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Enter tags separated by commas
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
                                        <FormLabel className="text-sm font-semibold">Read Time (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="5"
                                                className="border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                            Publish Article
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default NewsForm;
