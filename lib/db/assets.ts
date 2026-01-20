
import { createServerClient } from '../supabase';
import type { ProfileAsset, ProfileAssetType } from '../types';

// ============================================
// Profile Assets (Portfolio, Testimonials, Snippets, Profile Info)
// ============================================

export async function getProfileAssets(workspaceId: string, type?: ProfileAssetType): Promise<ProfileAsset[]> {
  const supabase = createServerClient();
  
  let query = supabase
    .from('profile_assets')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('[DB] Error fetching profile assets:', error.message);
    return [];
  }

  return data || [];
}

export async function getProfileInfo(workspaceId: string): Promise<ProfileAsset | null> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('profile_assets')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('type', 'profile_info')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.warn('[DB] Error fetching profile info:', error.message);
  }

  return data;
}

export async function upsertProfileInfo(workspaceId: string, data: Partial<ProfileAsset>): Promise<ProfileAsset> {
  const supabase = createServerClient();

  // Check if it exists
  const existing = await getProfileInfo(workspaceId);

  let result;
  if (existing) {
    // Update
    result = await supabase
      .from('profile_assets')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // Create
    result = await supabase
      .from('profile_assets')
      .insert({
        workspace_id: workspaceId,
        type: 'profile_info',
        title: 'Profile Info', // Default title
        ...data
      })
      .select()
      .single();
  }

  if (result.error) throw result.error;
  return result.data;
}

export async function createProfileAsset(workspaceId: string, asset: Partial<ProfileAsset>): Promise<ProfileAsset> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('profile_assets')
    .insert({
      workspace_id: workspaceId,
      ...asset
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfileAsset(workspaceId: string, id: string, asset: Partial<ProfileAsset>): Promise<ProfileAsset> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('profile_assets')
    .update({
      ...asset,
      updated_at: new Date().toISOString()
    })
    .eq('workspace_id', workspaceId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}


export async function getProfileAssetById(workspaceId: string, id: string): Promise<ProfileAsset | null> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('profile_assets')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
        console.warn('[DB] Error fetching profile asset by id:', error.message);
    }
    return null;
  }

  return data;
}

export async function deleteProfileAsset(workspaceId: string, id: string): Promise<void> {
  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('profile_assets')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', id);

  if (error) throw error;
}
