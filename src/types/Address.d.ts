type District = {
  id: number
  name: string
}

type Address = {
  id: number
  full_address: string
  bag_id: string
  district: District
  housing_corporation: number | null
  lat: number
  lng: number
  number: number
  nummeraanduiding_id: string
  postal_code: string
  street_name: string
  suffix: string
  suffix_letter: string
}
