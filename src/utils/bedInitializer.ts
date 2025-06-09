
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

    // Insert all beds
    const { error: insertError } = await supabase
      .from('beds')
      .insert(supabaseBeds);

    if (insertError) {
      console.error('Error initializing beds:', insertError);
    } else {
      console.log('Beds initialized successfully');
    }
  } catch (error) {
    console.error('Error in bed initialization:', error);
  }
};
