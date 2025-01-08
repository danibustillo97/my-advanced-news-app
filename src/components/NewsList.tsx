"use client"
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

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

const NewsPage = () => {
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
    <div className="container mt-5">
      {/* Slider */}
      <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {news.slice(0, 3).map((item, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={item.id}>
              <img
                src={`https://via.placeholder.com/1200x500?text=${item.title}`}
                className="d-block w-100"
                alt={item.title}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{item.title}</h5>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Featured News */}
      <section className="mt-5">
        <h2 className="text-center text-primary">Noticias Destacadas</h2>
        <div className="row">
          {news
            .filter((item) => item.is_featured)
            .map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="card mb-4 shadow-sm">
                  <img
                    src={`https://via.placeholder.com/350x200?text=${item.title}`}
                    className="card-img-top"
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.content.substring(0, 100)}...</p>
                    <a href={`/news/${item.id}`} className="btn btn-primary">
                      Leer más
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="mt-5">
        <h2 className="text-center text-primary">Últimas Noticias</h2>
        <div className="row">
          {news.slice(3, 9).map((item) => (
            <div className="col-md-4" key={item.id}>
              <div className="card mb-4 shadow-sm">
                <img
                  src={`https://via.placeholder.com/350x200?text=${item.title}`}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.content.substring(0, 100)}...</p>
                  <a href={`/news/${item.id}`} className="btn btn-primary">
                    Leer más
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
