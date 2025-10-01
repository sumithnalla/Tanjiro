import React from 'react';

export interface AddOn {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface EventType {
  id: string;
  name: string;
  icon: string;
}

export interface Cake {
  id: string;
  name: string;
  image: string;
  prices: {
    egg: {
      halfKg: number;
      oneKg: number;
    };
    eggless: {
      halfKg: number;
      oneKg: number;
    };
  };
}

export const addOns: AddOn[] = [
  {
    id: '1',
    name: 'LED HBD',
    price: 119,
    image:
      'https://i.pinimg.com/736x/24/5b/cc/245bcc1f3f850d23301416b4cfe8268f.jpg',
  },
  {
    id: '2',
    name: 'Fog Entry',
    price: 700,
    image:
      'https://i.pinimg.com/736x/b1/b1/21/b1b121c1fb58c376e600406e875c6d73.jpg',
  },
  {
    id: '3',
    name: 'Fog Entry + Cold Fire (2)',
    price: 1400,
    image:
      'https://i.pinimg.com/736x/2c/b4/d4/2cb4d454ec94675ab6aaf3a23d537cce.jpg',
  },
  {
    id: '4',
    name: 'Photo Props',
    price: 189,
    image:
      'https://i.pinimg.com/736x/20/63/0e/20630ecad25db83d32774bb1b2c175c3.jpg',
  },
  {
    id: '5',
    name: 'LED Name Letters',
    price: 299,
    image:
      'https://i.pinimg.com/736x/5e/55/6c/5e556c368ccca863b363a2ce5eb45047.jpg',
  },
  {
    id: '6',
    name: 'Table Décor',
    price: 299,
    image:
      'https://i.pinimg.com/736x/c9/29/38/c92938bd766aad79e76bdf0372eb5c7c.jpg',
  },
  {
    id: '7',
    name: 'Candles',
    price: 199,
    image:
      'https://i.pinimg.com/736x/cf/45/65/cf4565965b293db6bfaa32e466fe81e7.jpg',
  },
  {
    id: '8',
    name: 'Photoshoot (30 mins)',
    price: 600,
    image:
      'https://i.pinimg.com/736x/90/fc/9a/90fc9ab1deee5e949f6821ce9b0ce1c3.jpg',
  },
  {
    id: '9',
    name: 'Photoshoot (60 mins)',
    price: 1200,
    image:
      'https://i.pinimg.com/736x/90/fc/9a/90fc9ab1deee5e949f6821ce9b0ce1c3.jpg',
  },
  {
    id: '10',
    name: 'Sash & Crown',
    price: 199,
    image:
      'https://i.pinimg.com/736x/39/6b/d0/396bd0c5605d516457c8bd788659c60f.jpg',
  },
  {
    id: '11',
    name: 'Cold Fire',
    price: 700,
    image:
      'https://i.pinimg.com/736x/bc/19/84/bc1984a1557b2f4809e8975810d5556e.jpg',
  },
  {
    id: '12',
    name: 'Candle Faith',
    price: 199,
    image:
      'https://i.pinimg.com/736x/fa/b6/b6/fab6b6d775637cfdfdad3ff2ee401b17.jpg',
  },
  {
    id: '13',
    name: 'Fog in Room',
    price: 499,
    image:
      'https://i.pinimg.com/736x/e2/23/72/e22372b9774e96573ea2da424a8f7c1e.jpg',
  },
  {
    id: '14',
    name: 'LOVE',
    price: 99,
    image:
      'https://i.pinimg.com/736x/f0/4e/04/f04e042d1645e3642e139d6614d3fc34.jpg',
  },
  {
    id: '15',
    name: 'LED Numbers',
    price: 99,
    image:
      'https://i.pinimg.com/736x/1b/63/74/1b63740cf559f6235ff780140a8f6e93.jpg',
  },
  {
    id: '16',
    name: 'Bubble Entry',
    price: 200,
    image:
      'https://i.pinimg.com/736x/61/4c/2e/614c2e9b3c89511bff44935e8ddf9cfc.jpg',
  },
];

export const eventTypes: EventType[] = [
  {
    id: '1',
    name: 'Birthday',
    icon: 'https://i.pinimg.com/736x/7f/72/62/7f7262dd76de0b48c8f6bf89f7a3e858.jpg',
  },
  {
    id: '2',
    name: 'Anniversary',
    icon: 'https://i.pinimg.com/736x/ea/41/09/ea410938cbccbcaabeccaea475d25a69.jpg',
  },
  {
    id: '3',
    name: 'Romantic Date',
    icon: 'https://i.pinimg.com/736x/fb/ad/b2/fbadb2cccd254c42024ea42b5f094cd1.jpg',
  },
  {
    id: '4',
    name: 'Marriage Proposal',
    icon: 'https://i.pinimg.com/736x/c5/fd/8e/c5fd8e6bb46c53b9e1cf93d6b4e175bf.jpg',
  },
  {
    id: '5',
    name: 'Groom to Be',
    icon: 'https://i.pinimg.com/736x/46/b3/18/46b318658414707800b1e9bdf2413ef0.jpg',
  },
  {
    id: '6',
    name: 'Bride to Be',
    icon: 'https://i.pinimg.com/736x/6f/62/3d/6f623d1bffe536ec5c73416caba88ce4.jpg',
  },
  {
    id: '7',
    name: 'Baby Shower',
    icon: 'https://i.pinimg.com/736x/ee/de/44/eede44e50910d32705ec7a3a0195cbf0.jpg',
  },
  {
    id: '8',
    name: 'Private Party',
    icon: 'https://i.pinimg.com/736x/2b/de/51/2bde51a9f7003b5faa601c49cd5e6c56.jpg',
  },
];

export const cakes: Cake[] = [
  {
    id: '1',
    name: 'Vanilla',
    image:
      'https://i.pinimg.com/736x/65/34/ce/6534cec088245f1a0225f8ef3826e079.jpg',
    prices: {
      egg: {
        halfKg: 400,
        oneKg: 800,
      },
      eggless: {
        halfKg: 450,
        oneKg: 900,
      },
    },
  },
  {
    id: '2',
    name: 'Strawberry',
    image:
      'https://i.pinimg.com/736x/7d/15/cf/7d15cf3ff0d63448d6c4705ec9314747.jpg',
    prices: {
      egg: {
        halfKg: 400,
        oneKg: 800,
      },
      eggless: {
        halfKg: 450,
        oneKg: 900,
      },
    },
  },
  {
    id: '3',
    name: 'Butterscotch',
    image:
      'https://i.pinimg.com/736x/30/a2/ce/30a2cedb77fe4fa77441bf75ea4fe1da.jpg',
    prices: {
      egg: {
        halfKg: 400,
        oneKg: 800,
      },
      eggless: {
        halfKg: 450,
        oneKg: 900,
      },
    },
  },
  {
    id: '4',
    name: 'Pineapple',
    image:
      'https://i.pinimg.com/736x/20/51/5e/20515ea1e1e2cfbc31541b445a83d065.jpg',
    prices: {
      egg: {
        halfKg: 400,
        oneKg: 800,
      },
      eggless: {
        halfKg: 450,
        oneKg: 900,
      },
    },
  },
  {
    id: '5',
    name: 'Blueberry',
    image:
      'https://i.pinimg.com/736x/be/80/34/be80346650353263b5b5980f33fbb0a5.jpg',
    prices: {
      egg: {
        halfKg: 500,
        oneKg: 1000,
      },
      eggless: {
        halfKg: 550,
        oneKg: 1100,
      },
    },
  },
  {
    id: '6',
    name: 'Pista Malai',
    image:
      'https://i.pinimg.com/736x/08/24/39/0824396acb812abae218a3d6c77aa3e1.jpg',
    prices: {
      egg: {
        halfKg: 500,
        oneKg: 1000,
      },
      eggless: {
        halfKg: 550,
        oneKg: 1100,
      },
    },
  },
  {
    id: '7',
    name: 'Choco Truffle',
    image:
      'https://i.pinimg.com/736x/a3/b6/33/a3b6333b7224bb92924f051fbca3626d.jpg',
    prices: {
      egg: {
        halfKg: 600,
        oneKg: 1200,
      },
      eggless: {
        halfKg: 650,
        oneKg: 1300,
      },
    },
  },
  {
    id: '8',
    name: 'Chocolate Kitkat',
    image:
      'https://i.pinimg.com/736x/4d/bd/b5/4dbdb5fb766e5a02e9f577a94cd560ef.jpg',
    prices: {
      egg: {
        halfKg: 600,
        oneKg: 1200,
      },
      eggless: {
        halfKg: 650,
        oneKg: 1300,
      },
    },
  },
  {
    id: '9',
    name: 'White Forest',
    image:
      'https://i.pinimg.com/736x/9a/61/2e/9a612e67f61c976fc76fb45edc531c0b.jpg',
    prices: {
      egg: {
        halfKg: 500,
        oneKg: 1000,
      },
      eggless: {
        halfKg: 550,
        oneKg: 1100,
      },
    },
  },
  {
    id: '10',
    name: 'Black Forest',
    image:
      'https://i.pinimg.com/736x/21/d5/9b/21d59b01752770c492cd56edb69000d4.jpg',
    prices: {
      egg: {
        halfKg: 500,
        oneKg: 1000,
      },
      eggless: {
        halfKg: 550,
        oneKg: 1100,
      },
    },
  },
];
