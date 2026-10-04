import {
  GST_STATE_CODES,
  INDIAN_STATES,
  IndianState,
} from '@invoicely/constants';

const normalizeStateName = (name: string) =>
  name.trim().toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ');

const STATES_BY_NAME = new Map(
  INDIAN_STATES.map((state) => [normalizeStateName(state), state])
);

export const toIndianState = (name?: string | null): IndianState | null =>
  name ? STATES_BY_NAME.get(normalizeStateName(name)) ?? null : null;

export const getStateFromGstIn = (gstIn?: string | null): IndianState | null =>
  GST_STATE_CODES[gstIn?.trim().slice(0, 2) ?? ''] ?? null;
