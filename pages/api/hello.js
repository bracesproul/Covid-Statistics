import React, { useState, useEffect } from 'react';
import dbConnect from '../../utils/dbConnect';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC4CrqwVJR6gtxcMNjfIW5Gu1XiZoS9KNE",
  authDomain: "covid-statistics-ba5ab.firebaseapp.com",
  projectId: "covid-statistics-ba5ab",
  storageBucket: "covid-statistics-ba5ab.appspot.com",
  messagingSenderId: "626916936905",
  appId: "1:626916936905:web:60951abcc3c32a14519118",
  measurementId: "G-1NGPCE1JZX"
};
const app = initializeApp(firebaseConfig);

dbConnect();

export default async (req, res) => {
  res.json({ test: "test" });
}