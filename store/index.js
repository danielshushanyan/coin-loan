import currency from 'currency.js'
import FakeDB from '../services/fake-db'

export const state = () => ({
  budgets: [],
  baseCurrency: {}
})

export const getters = {
  allBudgets: state => state.budgets,
  getBudgetById: state => id => state.budgets.find(budget => budget.id === id)
}

export const actions = {
  setBudget({ commit, state }, data) {
    commit('setBudget', data)
    FakeDB.setToLocalStorage(state.budgets)
  },
  deleteBudget({ commit, state }, id) {
    commit('deleteBudget', id)
    FakeDB.setToLocalStorage(state.budgets)
  },
  addTransaction({ commit, state }, data) {
    commit('addTransaction', data)
    FakeDB.setToLocalStorage(state.budgets)
  },
  deleteTransaction({ commit, state }, data) {
    commit('deleteTransaction', data)
    FakeDB.setToLocalStorage(state.budgets)
  },
  setBaseCurrency({ commit, state }, currency) {
    commit('setBaseCurrency', currency)
    FakeDB.setToLocalStorage(state.budgets)
  },
  resetTransaction({ commit, state }, data) {
    commit('resetTransaction', data)
    FakeDB.setToLocalStorage(state.budgets)
  }
}

export const mutations = {
  setBudget: (state, newBudget) => {
    state.budgets.push(newBudget)
  },
  deleteBudget: (state, id) =>
    (state.budgets = state.budgets.filter(budget => budget.id !== id)),
  addTransaction: (state, data) => {
    const budget = state.budgets.find(budget => budget.id === data.id)
    budget.amount = currency(data.amount)
    budget.transactions.push(data.data)
  },
  deleteTransaction: (state, data) => {
    const budget = state.budgets.find(budget => budget.id === data.id)
    budget.amount = currency(data.amount)
    budget.transactions.splice(data.index, 1)
  },
  resetTransaction: (state, data) => {
    const budget = state.budgets.find(budget => budget.id === data.budgetId)
    const transactionIndex = budget.transactions.findIndex(
      item => item.id === data.transactionId
    )
    budget.amount = currency(data.amount)
    budget.transactions.splice(transactionIndex, 1)
  },
  setBaseCurrency: (state, currency) => (state.baseCurrency = currency)
}
