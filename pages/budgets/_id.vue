<template>
  <div>
    <v-btn outline class="ml-auto mb-3" color="primary" to="/budgets">
      <v-icon class="mr-1">arrow_back</v-icon>
      Go to budgets
    </v-btn>
    <v-card class="mb-3">
      <v-card-title v-if="budget">
        <h1 class="display-1">Budget for {{ budget.name }}</h1>
        <h2 class="display-1 ml-auto">
          {{ budget.amount }} {{ budget.currency }}
        </h2>
        <v-btn outline color="error" @click="resetTransactions">
          Reset all <v-icon class="ml-1">delete_sweep</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
    <cl-form
      v-if="budget"
      form-field-type="Transaction"
      class="budget-form mb-2"
      @submitForm="setTransaction"
    />
    <transition-group v-if="budget" name="list" tag="div" class="budget-card">
      <v-card
        v-for="(item, i) in budget.transactions"
        :key="`${i}-${item}`"
        class="mt-2 budget-card-item list-item"
      >
        <v-card-title primary-title>
          <div class="card-title">
            <h2 class="headline mb-0">{{ item.name }}</h2>
            <h2>{{ item.amount }} {{ item.currency }}</h2>
          </div>
        </v-card-title>

        <v-card-actions class="card-actions">
          <v-btn outline color="error" @click="deleteTransaction(i, item)">
            Delete
            <v-icon right dark>delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </transition-group>

    <v-snackbar
      v-model="snackbar"
      color="error"
      :multi-line="multiLine"
      :timeout="timeout"
    >
      Not enough credit
    </v-snackbar>
  </div>
</template>

<script>
import currency from 'currency.js'
import fx from 'money'
import { mapState } from 'vuex'
import ClForm from '../../components/cl-form'
import FakeDB from '../../services/fake-db'
import generateId from '../../services/generate-id'

export default {
  components: {
    ClForm
  },
  data() {
    return {
      budget: null,
      snackbar: false,
      multiLine: true,
      timeout: 6000,
      interval: null
    }
  },
  computed: mapState(['baseCurrency']),
  watch: {
    baseCurrency(newValue, oldValue) {
      fx.rates = newValue
    }
  },
  beforeCreate() {
    this.$nextTick(function() {
      this.budget = this.$store.getters.getBudgetById(this.$route.params.id)

      if (this.budget === undefined) {
        this.$router.push({ path: '/budgets' })
      }

      if (this.budget) {
        this.fetchRates(this.budget.currency)
        fx.base = this.budget.currency
      }
    })
  },
  mounted() {
    FakeDB.getFromLocalStorage(this.$store)
    this.interval = setInterval(() => {
      this.fetchRates(this.budget.currency)
    }, 30000)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    setTransaction(form) {
      const convertedAmount = this.convertCurrency(
        form.amount,
        form.currency,
        this.budget.currency
      )

      if (this.budget.amount >= convertedAmount) {
        this.createTransaction(form, convertedAmount)
      } else {
        this.snackbar = true
      }
    },
    deleteTransaction(i, transaction) {
      this.$store.dispatch('deleteTransaction', {
        index: i,
        id: this.budget.id,
        amount: currency(this.budget.amount).add(
          this.convertCurrency(
            transaction.amount.value,
            transaction.currency,
            this.budget.currency
          )
        )
      })
    },
    createTransaction(form, subtractAmount) {
      form.id = generateId()
      this.$store.dispatch('addTransaction', {
        data: form,
        id: this.budget.id,
        amount: this.budget.amount - subtractAmount
      })
    },
    fetchRates(currency) {
      this.$axios
        .get(`https://api.exchangeratesapi.io/latest?base=${currency}`)
        .then(res => {
          this.$store.dispatch('setBaseCurrency', res.data.rates)
        })
        .catch(err => {
          console.log(err)
        })
    },
    convertCurrency(amount, transCurrency, budgetCurrency) {
      return fx(amount)
        .from(transCurrency)
        .to(budgetCurrency)
    },
    resetTransactions() {
      const cloneTransactions = this.budget.transactions.slice(0)
      cloneTransactions.forEach(item => {
        this.$store.dispatch('resetTransaction', {
          transactionId: item.id,
          budgetId: this.budget.id,
          amount: currency(this.budget.amount).add(
            this.convertCurrency(
              item.amount.value,
              item.currency,
              this.budget.currency
            )
          )
        })
      })
    }
  }
}
</script>
