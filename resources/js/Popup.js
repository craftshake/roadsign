var Roadsign = {};
(function($){

/**
 * Roadsign popup class
 */
Roadsign.Popup = Garnish.Base.extend(
{
	items: null,
	modal: null,

	$modal: null,
	$input: null,

	init: function() {
		var that = this;

		// Let's get those DOM elements
		this.$modal = $('#roadsign-popup');
		this.$input = this.$modal.find('input:first');

		// Start up the modal
		this.modal = new Garnish.Modal(null, {onFadeIn: function() {
			that.$input.focus();
		}});

		// Listener to the keyboard
		this.addListener(Garnish.$doc, 'keydown', function(ev)
		{
			// Check for launch shortcut (CTRL + SHIFT + P)
			if ((ev.metaKey || ev.ctrlKey) && ev.shiftKey && ev.keyCode == Roadsign.Popup.P_KEY)
			{
				ev.preventDefault();

				// Show modal
				this.show();
			}
			return true;
		});
	},

	show: function() {
		this.modal.setContainer(this.$modal);
		this.modal.show();
	}

},
{
	P_KEY: 80
});

})(jQuery);
