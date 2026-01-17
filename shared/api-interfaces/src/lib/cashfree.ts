/* ---------------- Split Address ---------------- */
export interface IGstSplitAddress {
  building_name: string;
  street: string;
  location: string;
  building_number: string;
  district: string;
  state: string;
  city: string;
  flat_number: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

/* ---------------- Additional Address ---------------- */
export interface IGstAdditionalAddress {
  address: string;
  split_address: IGstSplitAddress;
}

/* ---------------- Main GST Verify Response ---------------- */
export interface IGstVerifyResponse {
  reference_id: number;
  GSTIN: string;

  legal_name_of_business: string;
  trade_name_of_business: string;

  center_jurisdiction: string;
  state_jurisdiction: string;

  date_of_registration: string; // ISO date string (YYYY-MM-DD)
  constitution_of_business: string;
  taxpayer_type: 'Regular';
  gst_in_status: 'Active' | 'Cancel';

  last_update_date: string;

  nature_of_business_activities: string[];

  principal_place_address: string;
  principal_place_split_address: IGstSplitAddress;

  additional_address_array: IGstAdditionalAddress[];

  valid: boolean;
  message: string;
}
