export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          country: "US" | "UK" | "DE" | "FR" | "ES" | "TR" | null;
          state_province: string | null;
          marriage_year: number | null;
          plan_type: "discovery" | "clarified" | "strategist" | "professional";
          plan_expires_at: string | null;
          paddle_customer_id: string | null;
          paddle_subscription_id: string | null;
          deleted_at: string | null;
          preferred_language: string | null;
          onboarding_completed: boolean;
          gdpr_consent: boolean;
          gdpr_consent_at: string | null;
          kvkk_consent: boolean;
          kvkk_consent_at: string | null;
          marketing_consent: boolean;
          is_white_label: boolean;
          white_label_firm_id: string | null;
          marketplace_eligible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          country?: "US" | "UK" | "DE" | "FR" | "ES" | "TR" | null;
          state_province?: string | null;
          marriage_year?: number | null;
          plan_type?: "discovery" | "clarified" | "strategist" | "professional";
          plan_expires_at?: string | null;
          paddle_customer_id?: string | null;
          paddle_subscription_id?: string | null;
          deleted_at?: string | null;
          preferred_language?: string | null;
          onboarding_completed?: boolean;
          gdpr_consent?: boolean;
          gdpr_consent_at?: string | null;
          kvkk_consent?: boolean;
          kvkk_consent_at?: string | null;
          marketing_consent?: boolean;
          is_white_label?: boolean;
          white_label_firm_id?: string | null;
          marketplace_eligible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          country?: "US" | "UK" | "DE" | "FR" | "ES" | "TR" | null;
          state_province?: string | null;
          marriage_year?: number | null;
          plan_type?: "discovery" | "clarified" | "strategist" | "professional";
          plan_expires_at?: string | null;
          paddle_customer_id?: string | null;
          paddle_subscription_id?: string | null;
          deleted_at?: string | null;
          preferred_language?: string | null;
          onboarding_completed?: boolean;
          gdpr_consent?: boolean;
          gdpr_consent_at?: string | null;
          kvkk_consent?: boolean;
          kvkk_consent_at?: string | null;
          marketing_consent?: boolean;
          is_white_label?: boolean;
          white_label_firm_id?: string | null;
          marketplace_eligible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          category: "real_estate" | "vehicle" | "bank" | "retirement" | "business" | "investment" | "crypto" | "other" | null;
          name: string;
          current_value: number;
          purchase_price: number | null;
          owned_by: "joint" | "me" | "spouse" | null;
          is_marital: boolean;
          acquisition_year: number | null;
          mortgage_balance: number;
          contribution_ratio: number;
          valuation_type: "user_stated" | "appraisal" | "tax_value" | "market_estimate" | "exchange_rate";
          notes: string | null;
          crypto_token: string | null;
          crypto_wallet_address: string | null;
          crypto_quantity: number | null;
          crypto_price_at_entry: number | null;
          crypto_exchange: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: "real_estate" | "vehicle" | "bank" | "retirement" | "business" | "investment" | "crypto" | "other" | null;
          name: string;
          current_value?: number;
          purchase_price?: number | null;
          owned_by?: "joint" | "me" | "spouse" | null;
          is_marital?: boolean;
          acquisition_year?: number | null;
          mortgage_balance?: number;
          contribution_ratio?: number;
          valuation_type?: "user_stated" | "appraisal" | "tax_value" | "market_estimate" | "exchange_rate";
          notes?: string | null;
          crypto_token?: string | null;
          crypto_wallet_address?: string | null;
          crypto_quantity?: number | null;
          crypto_price_at_entry?: number | null;
          crypto_exchange?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: "real_estate" | "vehicle" | "bank" | "retirement" | "business" | "investment" | "crypto" | "other" | null;
          name?: string;
          current_value?: number;
          purchase_price?: number | null;
          owned_by?: "joint" | "me" | "spouse" | null;
          is_marital?: boolean;
          acquisition_year?: number | null;
          mortgage_balance?: number;
          contribution_ratio?: number;
          valuation_type?: "user_stated" | "appraisal" | "tax_value" | "market_estimate" | "exchange_rate";
          notes?: string | null;
          crypto_token?: string | null;
          crypto_wallet_address?: string | null;
          crypto_quantity?: number | null;
          crypto_price_at_entry?: number | null;
          crypto_exchange?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      debts: {
        Row: {
          id: string;
          user_id: string;
          category: "mortgage" | "car_loan" | "credit_card" | "student_loan" | "personal_loan" | "other" | null;
          name: string;
          balance: number;
          monthly_payment: number | null;
          owned_by: "joint" | "me" | "spouse" | null;
          interest_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: "mortgage" | "car_loan" | "credit_card" | "student_loan" | "personal_loan" | "other" | null;
          name: string;
          balance?: number;
          monthly_payment?: number | null;
          owned_by?: "joint" | "me" | "spouse" | null;
          interest_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: "mortgage" | "car_loan" | "credit_card" | "student_loan" | "personal_loan" | "other" | null;
          name?: string;
          balance?: number;
          monthly_payment?: number | null;
          owned_by?: "joint" | "me" | "spouse" | null;
          interest_rate?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          person: "me" | "spouse" | null;
          annual_gross: number | null;
          annual_net: number | null;
          employment_type: "employed" | "self_employed" | "unemployed" | "retired" | "part_time" | null;
          other_income_annual: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          person?: "me" | "spouse" | null;
          annual_gross?: number | null;
          annual_net?: number | null;
          employment_type?: "employed" | "self_employed" | "unemployed" | "retired" | "part_time" | null;
          other_income_annual?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          person?: "me" | "spouse" | null;
          annual_gross?: number | null;
          annual_net?: number | null;
          employment_type?: "employed" | "self_employed" | "unemployed" | "retired" | "part_time" | null;
          other_income_annual?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          user_id: string;
          age: number | null;
          custody_arrangement: "primary_me" | "primary_spouse" | "joint_50_50" | "other" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age?: number | null;
          custody_arrangement?: "primary_me" | "primary_spouse" | "joint_50_50" | "other" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number | null;
          custody_arrangement?: "primary_me" | "primary_spouse" | "joint_50_50" | "other" | null;
        };
        Relationships: [];
      };
      scenarios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          scenario_type: "custom" | "offer_comparison" | "house_simulator";
          house_outcome: "i_keep" | "spouse_keeps" | "sell" | "not_applicable" | null;
          retirement_split_me: number;
          alimony_monthly: number;
          alimony_years: number;
          alimony_direction: "i_receive" | "i_pay";
          child_support_monthly: number;
          child_support_direction: "i_receive" | "i_pay";
          business_outcome: "i_keep" | "spouse_keeps" | "split" | "sell" | "not_applicable" | null;
          inflation_rate_override: number | null;
          offer_source: string | null;
          offer_raw_text: string | null;
          offer_entered_at: string | null;
          historical_comparison: Record<string, unknown> | null;
          compared_to_scenario_id: string | null;
          custom_notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          scenario_type?: "custom" | "offer_comparison" | "house_simulator";
          house_outcome?: "i_keep" | "spouse_keeps" | "sell" | "not_applicable" | null;
          retirement_split_me?: number;
          alimony_monthly?: number;
          alimony_years?: number;
          alimony_direction?: "i_receive" | "i_pay";
          child_support_monthly?: number;
          child_support_direction?: "i_receive" | "i_pay";
          business_outcome?: "i_keep" | "spouse_keeps" | "split" | "sell" | "not_applicable" | null;
          inflation_rate_override?: number | null;
          offer_source?: string | null;
          offer_raw_text?: string | null;
          offer_entered_at?: string | null;
          historical_comparison?: Record<string, unknown> | null;
          compared_to_scenario_id?: string | null;
          custom_notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          scenario_type?: "custom" | "offer_comparison" | "house_simulator";
          house_outcome?: "i_keep" | "spouse_keeps" | "sell" | "not_applicable" | null;
          retirement_split_me?: number;
          alimony_monthly?: number;
          alimony_years?: number;
          alimony_direction?: "i_receive" | "i_pay";
          child_support_monthly?: number;
          child_support_direction?: "i_receive" | "i_pay";
          business_outcome?: "i_keep" | "spouse_keeps" | "split" | "sell" | "not_applicable" | null;
          inflation_rate_override?: number | null;
          offer_source?: string | null;
          offer_raw_text?: string | null;
          offer_entered_at?: string | null;
          historical_comparison?: Record<string, unknown> | null;
          compared_to_scenario_id?: string | null;
          custom_notes?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          jurisdiction: string;
          net_worth_now: number | null;
          net_worth_year1: number | null;
          net_worth_year3: number | null;
          net_worth_year5: number | null;
          net_worth_year10: number | null;
          monthly_cash_flow: number | null;
          alimony_range_low: number | null;
          alimony_range_high: number | null;
          child_support_estimate: number | null;
          risk_score: number | null;
          confidence_label: "formula-based-estimate" | "scenario-model" | "requires-professional-review" | "limited-confidence" | null;
          is_shared_with_lawyer: boolean;
          negotiation_strategy: string | null;
          key_risks: unknown | null;
          raw_json: unknown | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          jurisdiction: string;
          net_worth_now?: number | null;
          net_worth_year1?: number | null;
          net_worth_year3?: number | null;
          net_worth_year5?: number | null;
          net_worth_year10?: number | null;
          monthly_cash_flow?: number | null;
          alimony_range_low?: number | null;
          alimony_range_high?: number | null;
          child_support_estimate?: number | null;
          risk_score?: number | null;
          confidence_label?: "formula-based-estimate" | "scenario-model" | "requires-professional-review" | "limited-confidence" | null;
          is_shared_with_lawyer?: boolean;
          negotiation_strategy?: string | null;
          key_risks?: unknown | null;
          raw_json?: unknown | null;
          tokens_used?: number | null;
          created_at?: string;
        };
        Update: {
          is_shared_with_lawyer?: boolean;
          negotiation_strategy?: string | null;
          key_risks?: unknown | null;
          raw_json?: unknown | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          pdf_url: string | null;
          language: string | null;
          scenarios_compared: unknown | null;
          report_type: "standard" | "premium" | "professional" | "attorney_ready";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pdf_url?: string | null;
          language?: string | null;
          scenarios_compared?: unknown | null;
          report_type?: "standard" | "premium" | "professional" | "attorney_ready";
          created_at?: string;
        };
        Update: {
          pdf_url?: string | null;
          language?: string | null;
          scenarios_compared?: unknown | null;
          report_type?: "standard" | "premium" | "professional" | "attorney_ready";
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          country: string | null;
          language: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          country?: string | null;
          language?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          country?: string | null;
          language?: string | null;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          metadata: unknown | null;
          user_visible: boolean;
          display_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          metadata?: unknown | null;
          user_visible?: boolean;
          display_text?: string | null;
          created_at?: string;
        };
        Update: {
          user_visible?: boolean;
          display_text?: string | null;
        };
        Relationships: [];
      };
      webhook_events: {
        Row: {
          event_id: string;
          event_type: string;
          outcome: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          event_type: string;
          outcome?: string;
          created_at?: string;
        };
        Update: {
          outcome?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
