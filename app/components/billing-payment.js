import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { generateYearsFromCurrent, generateMonthNumber } from '../utils/generated-dates';

export default Component.extend({
  flashes: service(),
  months: generateMonthNumber(),
  years: generateYearsFromCurrent(11),
  stripe: service(),

  makeStripePayment: task(function* () {
    try {
      const response = yield this.stripe.card.createToken({
        name: this.cardName,
        number: this.cardNumber,
        exp_month: this.expiryDateMonth,
        exp_year: this.expiryDateYear,
        cvc: this.cvc
      });
      const token = response.id;
      this.handleSubmit(token, this.cardNumber.slice(-4));
    } catch (error) {
      this.flashes.error('There was an error connecting to stripe. Please try again.');
    }
  }).drop(),

  actions: {

    handleKeyUp(value) {
      let spacedCardNumber = value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      this.set('cardNumber', spacedCardNumber);
    }

  }
});