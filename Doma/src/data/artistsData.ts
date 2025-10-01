export interface Venue {
  id: string;
  name: string;
  image: string;
  galleryImages: string[];
  price: number;
  baseMembers: number;
  extraPersonCharge: number;
  decorationFee: number;
  screenSize: string;
  refundPolicy: string;
  slots: string[];
  features: string[];
}

export const venuesData: Venue[] = [
  {
    id: '399e2ade-5d6d-4535-81a6-93ae43a637a5',
    name: 'Aura',
    image:
      'https://i.pinimg.com/736x/78/ff/cc/78ffccdd2071737b2cfc15bc1ab5bae4.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/97/d4/31/97d431eb8c5fdeba1df8a5c0804a1c3c.jpg',
      'https://i.pinimg.com/736x/97/68/af/9768af628ac15a9f95bdeee54dcba98a.jpg',
      'https://i.pinimg.com/736x/e0/8b/00/e08b0068686919b6395113b3420c7914.jpg',
      'https://i.pinimg.com/736x/ba/fe/a6/bafea6fe15f1123db97b86f482343bcf.jpg',
    ],
    price: 1799,
    baseMembers: 12,
    extraPersonCharge: 249,
    decorationFee: 400,
    screenSize: '120" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:30am - 12:30pm',
      '1:00pm - 4:00pm',
      '4:30pm - 6:00pm',
      '6:30pm - 9:30pm',
      '10:00pm - 1:00am',
    ],
    features: [
      '250/- per extra person, Maximum 12',
      'Premium sound system',
      'Comfortable seating',
      'Climate control',
      'Ambient lighting',
      'Refreshment service',
    ],
  },
  {
    id: '771c4da3-851e-431c-a490-8bb6bf93aa77',
    name: 'Couple',
    image:
      'https://i.pinimg.com/736x/7e/65/e3/7e65e33ee26c2f125fbf50f68f80a957.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/bb/60/64/bb60646248d97e8c9b30f639c120a573.jpg',
      'https://i.pinimg.com/736x/0a/b9/9d/0ab99d7b026e4b95eb6cd06c5755e854.jpg',
      'https://i.pinimg.com/736x/7e/65/e3/7e65e33ee26c2f125fbf50f68f80a957.jpg',
      'https://i.pinimg.com/736x/16/b7/73/16b773486a5f3303ea327e29c7901c79.jpg',
    ],
    price: 999,
    baseMembers: 2,
    extraPersonCharge: 249,
    decorationFee: 400,
    screenSize: '120" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:00am - 12:00pm',
      '12:30pm - 3:30pm',
      '4:00pm - 5:30pm',
      '6:00pm - 9:00pm',
      '9:30pm - 12:30am',
    ],
    features: [
      'For 2 people',
      'Decoration fee: ₹400 (mandatory)',
      'Premium acoustics',
      'Mood lighting',
      'Private atmosphere',
      'Refreshment service',
    ],
  },
  {
    id: '18c00f9e-21d0-4d77-ad5a-d831aa4ede07',
    name: 'Lunar',
    image:
      'https://i.pinimg.com/736x/97/d4/31/97d431eb8c5fdeba1df8a5c0804a1c3c.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/78/ff/cc/78ffccdd2071737b2cfc15bc1ab5bae4.jpg',
      'https://i.pinimg.com/736x/22/82/fa/2282fac701eacabb025d5708c20b5330.jpg',
      'https://i.pinimg.com/736x/67/e2/f9/67e2f9798e2a18b986aca93df7e18509.jpg',
      'https://i.pinimg.com/736x/b3/e7/f1/b3e7f174ab6879d6fdd046a5556d5bb9.jpg',
    ],
    price: 1299,
    baseMembers: 8,
    extraPersonCharge: 249,
    decorationFee: 400,
    screenSize: '133" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:30am - 12:30pm',
      '1:00pm - 4:00pm',
      '4:30pm - 6:00pm',
      '6:30pm - 9:30pm',
      '10:00pm - 1:00am',
    ],
    features: [
      '250/- per extra person, Maximum 8',
      'Spacious layout',
      'Premium sound',
      'Ambient lighting',
      'Lounge area',
      'Refreshment service',
    ],
  },
  {
    id: 'fdb9e954-7810-4ab5-9b7d-1483ec53669a',
    name: 'Minimax',
    image:
      'https://i.pinimg.com/736x/53/d9/03/53d903ffd2790f347dd04f2badca5339.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/e7/24/db/e724dbb74c29d1d7f0edb60bba7676cd.jpg',
      'https://i.pinimg.com/736x/24/a6/40/24a6405a8663c52707a5c9951a8c4a4b.jpg',
      'https://i.pinimg.com/736x/7d/eb/19/7deb19fd8d6b110cc4e52cfafb391b64.jpg',
      'https://i.pinimg.com/736x/53/d9/03/53d903ffd2790f347dd04f2badca5339.jpg',
    ],
    price: 2399,
    baseMembers: 20,
    extraPersonCharge: 249,
    decorationFee: 400,
    screenSize: '175" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '10:00am - 1:00pm',
      '1:30pm - 4:30pm',
      '5:00pm - 6:30pm',
      '7:00pm - 10:00pm',
      '10:30pm - 1:00am',
    ],
    features: [
      '250/- per extra person, Maximum 20',
      'Largest screen size',
      'Premium sound system',
      'Party lighting',
      'Extended seating',
      'Full service options',
    ],
  },
];
