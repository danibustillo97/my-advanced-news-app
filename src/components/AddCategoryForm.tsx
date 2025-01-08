"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddCategoryForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }]);

    if (error) {
      console.error(error);
    } else {
      setName('');
      // Optionally, you can refetch the category list here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-category-form">
      <h2>Añadir Categoría</h2>
      <input
        type="text"
        placeholder="Nombre de la categoría"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Añadir</button>
    </form>
  );
};

export default AddCategoryForm;
