<template>
  <div>
    <cl-form
      form-field-type="Budget"
      class="budget-form"
      @submitForm="setBudget"
    />
    <transition-group name="list" tag="div" class="budget-card">
      <v-card
        v-for="(item, i) in allBudgets"
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
          <v-btn outline color="primary" :to="'/budgets/' + item.id">
            Open
          </v-btn>
          <v-btn outline color="error" @click="deleteBudget(item.id)">
            Delete
            <v-icon right dark>delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClForm from '../../components/cl-form'
import FakeDB from '../../services/fake-db'
import generateId from '../../services/generate-id'

export default {
  components: {
    ClForm
  },
  computed: mapGetters(['allBudgets']),
  mounted() {
    FakeDB.getFromLocalStorage(this.$store)
  },
  methods: {
    setBudget(form) {
      form.id = generateId()
      form.transactions = []
      this.$store.dispatch('setBudget', form)
    },
    deleteBudget(id) {
      this.$store.dispatch('deleteBudget', id)
    }
  }
}
</script>

<style lang="stylus">
.list-enter-active, .list-leave-active
  transition all 500ms ease-in-out
.list-enter, .list-leave-to
  opacity 0
  transform translateY(30px)
.list-leave-active
  position: relative

.budget
  &-form
    width 100%

  &-card
    display flex
    flex-wrap wrap
    margin 0 -15px

    &-item
      margin 0 15.4px
      width calc(33% - 25px)

.card
  &-title
    width 100%
    display flex
    justify-content space-between

  &-actions
    display flex
    justify-content flex-end
</style>
