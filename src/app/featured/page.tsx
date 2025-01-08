"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_featured: boolean;
  category: {
    id: string;
    name: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
}

const FeaturedNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select(`
          id,
          title,
          content,
          created_at,
          is_featured,
          category:categories(id, name),
          tags:news_tags(tag_id, tags(id, name))
        `)
        .eq('is_featured', true);

      if (error) {
        console.error(error);
      } else {
        const formattedData = data.map((item: any) => ({
          ...item,
          category: item.category[0],
          tags: item.tags.map((tag: any) => tag.tags)
        }));
        setNews(formattedData as NewsItem[]);
      }
    };

    fetchFeaturedNews();
  }, []);

  return (
    <div>
      <h1>Noticias Destacadas</h1>
      {news.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.content}</p>
          <small>{new Date(item.created_at).toLocaleString()}</small>
          <p>Categoría: {item.category.name}</p>
          <p>Etiquetas: {item.tags.map(tag => tag.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedNews;
