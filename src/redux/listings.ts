import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Listing } from "../lib/applicationTypes";

export type ListingsSlice = {
  open: Listing[];
  claimed: Listing[];
}

const initialState: ListingsSlice = {
  open: [],
  claimed: [{
    id: "listing-6",
    name: "ROYAL CHARTER ENERGY",
    physicalAddress: {
      address1: "1 New Terra Ln.",
      address2: "",
      city: "Charlotte",
      state: "NC",
      zip: "14573",
    },
    mailingAddress: null,
    reason: ''
  }],
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    initOpenListings: (state, action: PayloadAction<Listing[]>) => {
      state.open = action.payload;
    },
    claimListing: (state, action: PayloadAction<Listing>) => {
      const newClaim = action.payload;

      state.open = state.open.filter((l) => l.id !== newClaim.id);
      state.claimed.push(newClaim)
    },
    updateClaimedListingReason: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const { id, reason } = action.payload;
      const listingIndex = state.claimed.findIndex((listing) => listing.id === id);
      if (listingIndex !== -1) {
        state.claimed[listingIndex].reason = reason;
      }
    },
  },
});

export const {
  initOpenListings,
  claimListing,
  updateClaimedListingReason
} = listingsSlice.actions;

// Selectors

export const selectOpenListings = (({ listings }: RootState) => listings.open);
export const selectClaimedListings = (({ listings }: RootState) => listings.claimed);

export const selectClaimedListingById = createSelector(
  [
    selectClaimedListings,
    (state, id: string | null) => id,
  ],
  (listings, id) => listings.find((l) => l.id === id) || null,
);

export default listingsSlice;
