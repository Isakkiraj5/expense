import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { createExpense, getExpenses } from '../api';

const Expenses = () => {
  const Navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const userId = localStorage.getItem('userId');
        setUserId(userId);
        const response = await getExpenses(userId);
        setExpenses(response.data);
      } catch (error) {
        setError('An error occurred while fetching expenses.');
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filterCategory, minAmount, maxAmount]);

  const applyFilters = () => {
    let filtered = expenses;

    if (filterCategory) {
      filtered = filtered.filter(expense => expense.category.toLowerCase().includes(filterCategory.toLowerCase()));
    }

    if (minAmount) {
      filtered = filtered.filter(expense => parseFloat(expense.amount) >= parseFloat(minAmount));
    }

    if (maxAmount) {
      filtered = filtered.filter(expense => parseFloat(expense.amount) <= parseFloat(maxAmount));
    }

    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createExpense(userId, amount, category);
      setExpenses([...expenses, response.data]);
      setAmount('');
      setCategory('');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    Navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilterCategory('');
    setMinAmount('');
    setMaxAmount('');
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    let total = 0;
    expenses.forEach(expense => {
      total += parseFloat(expense.amount);
    });
    return total.toFixed(2);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          {userId && (
            <div>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ ml: 2 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            sx={{ mr: 2 }}
          />
          <TextField 
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            required
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Expense
          </Button>
        </form>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outlined" color="primary" sx={{ mt: 2 }}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        {showFilters && (
          <div sx={{ mb: 2 }}>
            <TextField
              label="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Min Amount"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Max Amount"
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button onClick={clearFilters} variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Clear Filters
            </Button>
          </div>
        )}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Expenses: ${getTotalExpenses()}
        </Typography>
      </Container>
    </>
  );
};

export default Expenses;
