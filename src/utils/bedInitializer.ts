
import { supabase } from '@/integrations/supabase/client';
import { getInitialBeds } from '@/data/initialBeds';

export const initializeBeds = async () => {
  try {
    // Check if beds already exist
    const { data: existingBeds, error: fetchError } = await supabase
      .from('beds')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.error('Error checking existing beds:', fetchError);
      return;
    }

    // If beds already exist, don't initialize
    if (existingBeds && existingBeds.length > 0) {
      console.log('Beds already exist, skipping initialization');
      return;
    }

    // Get initial beds from data file
    const initialBeds = getInitialBeds();
    
    // Transform to Supabase format
    const supabaseBeds = initialBeds.map(bed => ({
      id: bed.id,
      name: bed.name,
      department: bed.department,
      status: 'available' as const,
      is_custom: bed.isCustom || false
    }));

    // Insert all beds in batches to avoid potential limits
    const batchSize = 100;
    for (let i = 0; i < supabaseBeds.length; i += batchSize) {
      const batch = supabaseBeds.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('beds')
        .insert(batch);

      if (insertError) {
        console.error('Error initializing beds batch:', insertError);
        return;
      }
    }

    console.log('Beds initialized successfully - total:', supabaseBeds.length);
  } catch (error) {
    console.error('Error in bed initialization:', error);
  }
};
