import Ember from 'ember';

export default Ember.Component.extend({
	check: Ember.computed('text', function() {
		const text = this.get('text');
		return text;
	})
});
