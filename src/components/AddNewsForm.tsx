"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface News {
    id: string;
    title: string;
    content: string;
    category_id: string;
    category_name: string;
    main_image_url: string;
    additional_image_urls: string[];
}

const AddNewsForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newsList, setNewsList] = useState<News[]>([]);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);

    const fetchNews = async () => {
        const { data, error } = await supabase
            .from("news")
            .select("id, title, content, category_id, categories(name), main_image_url, additional_image_urls")
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else {
            setNewsList(data?.map((newsItem) => ({
                id: newsItem.id,
                title: newsItem.title,
                content: newsItem.content,
                category_id: newsItem.category_id,
                category_name: newsItem.categories?.[0]?.name || 'Sin categoría',
                main_image_url: newsItem.main_image_url,
                additional_image_urls: newsItem.additional_image_urls || [],
            })) as News[]);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("*");
            if (error) console.error(error);
            else setCategories(data as Category[]);
        };

        const fetchTags = async () => {
            const { data, error } = await supabase.from("tags").select("*");
            if (error) console.error(error);
            else setAvailableTags(data as Tag[]);
        };

        fetchCategories();
        fetchTags();
        fetchNews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Upload main image
        let mainImageUrl = '';
        if (mainImageFile) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`news/${mainImageFile.name}`, mainImageFile);
            if (error) console.error(error);
            else mainImageUrl = data.path;
        }

        // Upload additional images
        const additionalImageUrls: string[] = [];
        for (const file of additionalImageFiles) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`news/${file.name}`, file);
            if (error) console.error(error);
            else additionalImageUrls.push(data.path);
        }

        const { data, error } = await supabase
            .from("news")
            .insert([{
                title,
                content,
                category_id: categoryId,
                main_image_url: mainImageUrl,
                additional_image_urls: additionalImageUrls
            }])
            .select("id");

        if (error) {
            console.error(error);
        } else if (data) {
            const newsId = data[0].id;
            const tagInserts = tags.map((tagId) => ({ news_id: newsId, tag_id: tagId }));
            await supabase.from("news_tags").insert(tagInserts);
            setTitle("");
            setContent("");
            setCategoryId("");
            setTags([]);
            setMainImageFile(null);
            setAdditionalImageFiles([]);
            fetchNews(); // Refresh news list
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        const { data, error } = await supabase
            .from("categories")
            .insert([{ name: newCategory }])
            .select();
        if (error) console.error(error);
        else {
            setCategories([...categories, data[0]]);
            setNewCategory("");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) console.error(error);
        else setCategories(categories.filter((category) => category.id !== id));
    };

    const handleEditCategory = async (id: string) => {
        const name = prompt("Edit category name:");
        if (name) {
            const { data, error } = await supabase
                .from("categories")
                .update({ name })
                .eq("id", id)
                .select();
            if (error) console.error(error);
            else setCategories(categories.map((category) => (category.id === id ? { ...category, name } : category)));
        }
    };

    return (
        <div className="container-fluid mt-5" style={{ color: "white" }}>
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header" style={{ backgroundColor: "#001433", color: "white" }}>
                            <h4>Añadir Noticia</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label" style={{ color: "white" }}>
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="form-control"
                                        placeholder="Título de la noticia"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label" style={{ color: "white" }}>
                                        Contenido
                                    </label>
                                    <textarea
                                        id="content"
                                        className="form-control"
                                        rows={4}
                                        placeholder="Escribe el contenido"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label" style={{ color: "white" }}>
                                        Categoría
                                    </label>
                                    <select
                                        id="category"
                                        className="form-select"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No hay categorías disponibles.</option>
                                        )}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tags" className="form-label" style={{ color: "white" }}>
                                        Etiquetas
                                    </label>
                                    <select
                                        id="tags"
                                        className="form-select"
                                        multiple
                                        value={tags}
                                        onChange={(e) =>
                                            setTags(Array.from(e.target.selectedOptions, (option) => option.value))
                                        }
                                    >
                                        {availableTags.length > 0 ? (
                                            availableTags.map((tag) => (
                                                <option key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No hay etiquetas disponibles.</option>
                                        )}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mainImage" className="form-label" style={{ color: "white" }}>
                                        Imagen Principal
                                    </label>
                                    <input
                                        type="file"
                                        id="mainImage"
                                        className="form-control"
                                        onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="additionalImages" className="form-label" style={{ color: "white" }}>
                                        Imágenes Adicionales
                                    </label>
                                    <input
                                        type="file"
                                        id="additionalImages"
                                        className="form-control"
                                        multiple
                                        onChange={(e) => setAdditionalImageFiles(Array.from(e.target.files || []))}
                                    />
                                </div>
                                <button type="submit" className="btn btn-light w-100" style={{ backgroundColor: "#001433", color: "white" }}>
                                    Añadir
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header" style={{ backgroundColor: "#001433", color: "white" }}>
                                    <h5>Categorías</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                    style={{ backgroundColor: "#001433", color: "white" }}
                                                >
                                                    {category.name}
                                                    <div>
                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => handleEditCategory(category.id)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No hay categorías disponibles.</li>
                                        )}
                                    </ul>
                                    <div className="input-group mt-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nueva categoría"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-light"
                                            onClick={handleAddCategory}
                                            style={{ backgroundColor: "#001433", color: "white" }}
                                        >
                                            Añadir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-4">
                    <div className="card shadow-sm">
                        <div className="card-header" style={{ backgroundColor: "#001433", color: "white" }}>
                            <h5>Noticias</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Contenido</th>
                                        <th>Categoría</th>
                                        <th>Imagen Principal</th>
                                        <th>Imágenes Adicionales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList.length > 0 ? (
                                        newsList.map((news) => (
                                            <tr key={news.id}>
                                                <td>{news.title}</td>
                                                <td>{news.content}</td>
                                                <td>{news.category_name}</td>
                                                <td>
                                                    {news.main_image_url && (
                                                        <img src={`${supabase.storage.from('images').getPublicUrl(news.main_image_url)}`} alt="Main" style={{ width: '100px' }} />
                                                    )}
                                                </td>
                                                <td>
                                                    {news.additional_image_urls.map((url, index) => (
                                                        <img key={index} src={`${supabase.storage.from('images').getPublicUrl(url)}`} alt={`Additional ${index}`} style={{ width: '100px' }} />
                                                    ))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>No hay noticias disponibles.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewsForm;
