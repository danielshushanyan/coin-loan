<template>
  <v-card>
    <v-form v-model="valid" card>
      <v-container>
        <v-layout>
          <v-flex xs12 md4>
            <v-text-field
              v-model="form.name"
              :label="formFieldType + ' name'"
              :counter="10"
              required
              outline
              :error-messages="nameErrors"
              @input="$v.form.name.$touch()"
              @blur="$v.form.name.$touch()"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="form.currency"
              :items="currencyItems"
              :label="formFieldType + ' currency'"
              required
              outline
              :error-messages="currencyErrors"
              @input="$v.form.currency.$touch()"
              @blur="$v.form.currency.$touch()"
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-text-field
              v-model="form.amount"
              :label="formFieldType + ' amount'"
              type="number"
              step="0.01"
              required
              outline
              :error-messages="amountErrors"
              @input="$v.form.amount.$touch()"
              @blur="$v.form.amount.$touch()"
            ></v-text-field>
          </v-flex>

          <v-flex>
            <v-btn color="primary" :disabled="$v.form.$invalid" @click="submit">
              submit
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import currency from 'currency.js'
import { required, maxLength, between } from 'vuelidate/lib/validators'

export default {
  props: {
    formFieldType: {
      type: String,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  validations: {
    form: {
      currency: { required },
      name: { required, maxLength: maxLength(10) },
      amount: { required, between: between(1, 1000000) }
    }
  },
  data: () => ({
    valid: false,
    form: {
      currency: '',
      name: '',
      amount: ''
    },
    currencyItems: ['USD', 'EUR', 'GBP', 'RUB']
  }),
  computed: {
    currencyErrors() {
      const errors = []
      if (!this.$v.form.currency.$dirty) return errors
      !this.$v.form.currency.required && errors.push('Item is required')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.maxLength &&
        errors.push('Name must be at most 10 characters long')
      !this.$v.form.name.required && errors.push('Name is required.')
      return errors
    },
    amountErrors() {
      const errors = []
      if (!this.$v.form.amount.$dirty) return errors
      !this.$v.form.amount.between &&
        errors.push('Must be between 1 and 1.000.000')
      !this.$v.form.amount.required && errors.push('Amount is required')
      return errors
    }
  },
  methods: {
    submit() {
      const submittedForm = {
        currency: this.form.currency,
        name: this.form.name,
        amount: currency(this.form.amount)
      }
      this.$emit('submitForm', submittedForm)
      this.$v.form.$reset()
      this.form = {
        currency: '',
        name: '',
        amount: ''
      }
    }
  }
}
</script>
