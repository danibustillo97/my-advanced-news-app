"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddTagForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name }]);

    if (error) {
      console.error(error);
    } else {
      setName('');
      // Optionally, you can refetch the tag list here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-tag-form">
      <h2>Añadir Etiqueta</h2>
      <input
        type="text"
        placeholder="Nombre de la etiqueta"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Añadir</button>
    </form>
  );
};

export default AddTagForm;
