import axios from 'axios';

const API_URL = 'https://expense-back-q0qx.onrender.com/api';

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const signup = (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

export const createExpense = (userId, amount, category) => {
  return axios.post(`${API_URL}/expense`, { userId, amount, category });
};

export const getExpenses = (userId) => {
  return axios.get(`${API_URL}/expenses/${userId}`);
};
