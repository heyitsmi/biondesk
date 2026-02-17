import { createServerClient } from "@/lib/supabase";

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired' | 'none';

interface TrialSettings {
  days: number;
}

export const SubscriptionService = {
  /**
   * Get global trial settings
   */
  async getTrialSettings(): Promise<TrialSettings> {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'trial_settings')
      .single();

    if (error || !data) {
      return { days: 7 }; // Default fallback
    }

    return data.value as TrialSettings;
  },

  /**
   * Create a trial subscription for a user
   */
  async createTrialSubscription(userId: string) {
    const settings = await this.getTrialSettings();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + settings.days);

    const supabase = createServerClient();
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'trialing',
        trial_start: startDate.toISOString(),
        trial_end: endDate.toISOString(),
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
      });

    if (error) {
      console.error("Failed to create trial subscription:", error);
      throw error;
    }
  },

  /**
   * Check subscription status for a user
   */
  async getUserSubscription(userId: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
       console.error("Error fetching subscription:", error);
       return null;
    }
    
    return data;
  },

  /**
   * Basic check if user has access
   */
  async hasActiveAccess(userId: string): Promise<boolean> {
      const sub = await this.getUserSubscription(userId);
      if (!sub) return false;

      const now = new Date();
      
      // If manually expired or canceled
      if (['expired', 'canceled'].includes(sub.status)) {
          // Double check dates just in case they have remaining time?
          // Usually strict status check is safer.
          // For now, trust the status logic + date check as backup
          return new Date(sub.current_period_end) > now;
      }
      
      // If trialing or active
      if (['trialing', 'active'].includes(sub.status)) {
          // Check if actually expired by date but status not updated
          if (sub.trial_end && new Date(sub.trial_end) < now && sub.status === 'trialing') {
              return false;
          }
           if (sub.current_period_end && new Date(sub.current_period_end) < now) {
              return false;
          }
          return true;
      }

      return false;
  }
};
