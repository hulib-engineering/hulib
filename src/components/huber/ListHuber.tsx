'use client';

import React from 'react';

import Huber from './Huber';

const hubersData = [
  {
    name: 'Tran Thanh Thao',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 0,
  },
  {
    name: 'Jumai Wale',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 1,
  },
  {
    name: 'Kibwe Tanton',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 2,
  },
  {
    name: 'Fabrice Sandrine',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 3,
  },
  {
    name: 'Claire Simone',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 4,
  },
  {
    name: 'Wiebke Karoline',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/huber/cover-huber.png',
    id: 5,
  },
];

const ListHuber = ({ hubers = hubersData }) => {
  return (
    <div className="w-full px-4 py-6 md:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {hubers.map((huber) => (
          <div key={huber.id} className="w-full">
            <Huber />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListHuber;
