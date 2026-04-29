import { supabase } from './supabase';

export const uploadLogo = async (file) => {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `logo.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const getLogoUrl = async () => {
  const { data } = await supabase.storage.from('logos').list('logos', { limit: 1 });
  if (data && data.length > 0) {
    const filePath = `logos/${data[0].name}`;
    const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  }
  return null;
};
