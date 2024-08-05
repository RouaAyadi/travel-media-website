'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users.');
        console.error('Failed to fetch users:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Users List</h1>
      {users.map(user => (
        <div key={user.id}>
          <Link href={`/${user.id}`}>
           {user.username}'s Profile
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UsersListPage;