import $ from 'jquery';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  tabStates: service(),
  repositories: service(),
  features: service(),

  redirect() {
    if (this.get('auth.signedIn')) {
      if (this.get('features.dashboard')) {
        this.transitionTo('dashboard');
      }
    } else if (this.get('features.enterpriseVersion')) {
      this.transitionTo('auth');
    }
  },

  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      $('body').attr('id', 'home');
    }
    this._super(args);
    this.render('build/index', {into: 'index', controller: 'build/index'});
  },

  activate(...args) {
    this._super(args);
    if (this.get('auth.signedIn')) {
      this.tabStates.set('sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'current');
    }
  },

  deactivate() {
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.stopObservingRepoStatus();
    return this._super(...arguments);
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
  },

  actions: {
    redirectToGettingStarted() {
      return this.transitionTo('getting_started');
    },
  },
});
