'use client';

import React from 'react';
import { UserProvider } from './User';
import { TripProvider } from './Trip';

const StoreProvider = ({ children }) => (
    <UserProvider>

        <TripProvider>

            {children}

        </TripProvider>

    </UserProvider>


);
export default StoreProvider;