"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_featured: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  tags: {
    id: string;
    name: string;
  }[];
}

const NewsList = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select(
          `
          id,
          title,
          content,
          created_at,
          is_featured,
          category:categories(id, name),
          tags:news_tags(tags(id, name))
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching news:", error.message);
      } else {
        const formattedData = data.map((item: any) => ({
          ...item,
          category: item.category?.[0] || null,
          tags: item.tags ? item.tags.map((tag: any) => tag.tags) : [],
        }));
        setNews(formattedData as NewsItem[]);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2rem", color: "#333" }}>
        Noticias
      </h1>
      {news.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No hay noticias disponibles.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {news.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ padding: "16px" }}>
                <h2 style={{ fontSize: "1.5rem", color: "#510C76" }}>{item.title}</h2>
                <p style={{ color: "#555", marginBottom: "8px" }}>{item.content}</p>
                <small style={{ display: "block", color: "#888", marginBottom: "8px" }}>
                  {new Date(item.created_at).toLocaleString()}
                </small>
                <p style={{ margin: "8px 0", fontSize: "0.9rem", color: "#333" }}>
                  <strong>Categoría:</strong> {item.category?.name || "Sin categoría"}
                </p>
                <p style={{ margin: "8px 0", fontSize: "0.9rem", color: "#333" }}>
                  <strong>Etiquetas:</strong>{" "}
                  {item.tags.length > 0 ? item.tags.map((tag) => tag.name).join(", ") : "Sin etiquetas"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
