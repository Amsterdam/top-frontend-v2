export const ItineraryListItemVariant = {
  Default: "default",
  AddStartAddress: "addStartAddress",
  AddSuggestedCase: "addSuggestedCase",
  AddToItinerary: "addToItinerary",
} as const

export type ItineraryListItemVariant =
  (typeof ItineraryListItemVariant)[keyof typeof ItineraryListItemVariant]
