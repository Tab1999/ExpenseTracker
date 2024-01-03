
import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ExpenseForm.module.css';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { setExpenses, addExpense, updateExpense, deleteExpense } from '../store/expense';

const ExpenseInput = ({ label, type, value, onChange, required }) => {
  return (
    <div className={styles.formControl}>
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
};

const ExpenseForm = () => {
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses);
  const userId = useSelector((state) => state.auth.userId);

  // Add state for dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [userId]);

  const fetchExpenses = async () => {
    if (!userId) return;

    const expensesCollection = collection(db, `users/${userId}/expenses`);
    const expensesSnapshot = await getDocs(expensesCollection);

    const fetchedExpenses = [];
    expensesSnapshot.forEach((doc) => {
      fetchedExpenses.push({ id: doc.id, ...doc.data() });
    });

    dispatch(setExpenses(fetchedExpenses));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = {
      moneySpent: +moneySpent,
      description,
      category,
    };

    if (editingExpense) {
      const expenseDocRef = doc(db, `users/${userId}/expenses`, editingExpense.id);
      await updateDoc(expenseDocRef, formData);
      dispatch(updateExpense({ id: editingExpense.id, ...formData }));
    } else {
      const expensesCollection = collection(db, `users/${userId}/expenses`);
      const docRef = await addDoc(expensesCollection, {
        ...formData,
        userId: userId,
      });
      dispatch(addExpense({ id: docRef.id, ...formData }));
    }

    setMoneySpent('');
    setDescription('');
    setCategory('');
  };

  const deleteHandler = async (expenseId) => {
    const expenseDocRef = doc(db, `users/${userId}/expenses`, expenseId);
    await deleteDoc(expenseDocRef);
    dispatch(deleteExpense(expenseId));
  };

  const editHandler = (expense) => {
    setEditingExpense(expense);
    setMoneySpent(expense.moneySpent.toString());
    setDescription(expense.description);
    setCategory(expense.category);
  };

  const cancelEditHandler = () => {
    setEditingExpense(null);
    setMoneySpent('');
    setDescription('');
    setCategory('');
  };

  const toggleThemeHandler = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const downloadExpensesHandler = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Money Spent,Description,Category\n' +
      expenses.map((expense) => `${expense.moneySpent},${expense.description},${expense.category}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'expenses.csv';
    link.click();
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.moneySpent, 0);

  return (
    <div className={`${styles.expenseContainer} ${darkMode ? styles.darkTheme : ''}`}>
      <form className={styles.expenseForm} onSubmit={submitHandler}>
        <ExpenseInput label="Money Spent" type="number" value={moneySpent} onChange={setMoneySpent} required />
        <ExpenseInput label="Description" type="text" value={description} onChange={setDescription} required />
        <ExpenseInput label="Category" type="text" value={category} onChange={setCategory} required />
        <div className={styles.formActions}>
          <button type="submit">Submit</button>
          {editingExpense && (
            <button type="button" onClick={cancelEditHandler}>
              Cancel
            </button>
          )}
          {totalExpenses > 10000 && <button className={styles.premiumButton}>Activate Premium</button>}
          {totalExpenses > 10000 && (
            <button className={styles.themeToggle} onClick={toggleThemeHandler}>
              Toggle Theme
            </button>
          )}
        </div>
      </form>
      <div className={styles.expenseList}>
        <h2 style={{ textAlign: 'center' }}>Expense List</h2>
        {expenses.length === 0 && <p>No expenses yet.</p>}
        {expenses.map((expense) => (
          <div key={expense.id} className={styles.expenseItem}>
            <div className={styles.items}>
              <p>Money Spent: {expense.moneySpent}</p>
              <p>Description: {expense.description}</p>
              <p>Category: {expense.category}</p>
            </div>
            <div className={styles.buttons}>
              <button style={{ marginLeft: '21rem' }} onClick={() => deleteHandler(expense.id)}>
                Delete
              </button>
              <button onClick={() => editHandler(expense)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      {totalExpenses > 10000 && (
        <button onClick={downloadExpensesHandler} className={styles.downloadButton}>
          Download Expenses
        </button>
      )}
    </div>
  );
};

export default ExpenseForm;
