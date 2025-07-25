import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SNavbar from './SNavbar';
import CustomizedTables from '../component/CustomizedTables';

const SDashboard = () => {
  return (
    <>
      <SNavbar />
      <Routes>
        <Route path="/" element={<CustomizedTables />} />
      </Routes>
    </>
  );
};

export default SDashboard;