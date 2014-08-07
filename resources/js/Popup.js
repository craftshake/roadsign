var Roadsign = {};
(function($){

/**
 * Roadsign popup class
 */
Roadsign.Popup = Garnish.Base.extend(
{
	signs: null,
	modal: null,
	active: null,

	$modal: null,
	$input: null,
	$results: null,

	init: function(signsJSON) {
		// Populate signs to search through
		this.signs = signsJSON;

		console.log(this.signs);

		// Let's get those DOM elements
		this.$modal = $('#roadsign-popup');
		this.$input = this.$modal.find('input:first');
		this.$results = this.$modal.find('.roadsign-results:first');

		// Set default state to inactive
		this.active = false;

		// Start up the modal
		var that = this;
		this.modal = new Garnish.Modal(null, {
			onFadeIn: function() {
				// Set focus on the search box
				that.$input.focus();
			},
			onFadeOut: function() {
				// Change state
				that.active = false;
			}
		});

		// Initialiase results to display all signs
		this.updateResults(this.signs);

		// Search when a key is released
		this.addListener(this.$input, 'keyup', this.search);

		// Listen to the keypresses
		this.addListener(Garnish.$doc, 'keydown', function(ev)
		{
			// Check for launch shortcut (CTRL + SHIFT + P)
			if ((ev.metaKey || ev.ctrlKey) && ev.shiftKey && ev.keyCode == Roadsign.Popup.F_KEY)
			{
				ev.preventDefault();

				// Show modal
				this.show();
			}
			return true;
		});
	},

	show: function() {
		// Avoid double instantation
		if (!this.modal.$container) {
			this.modal.setContainer(this.$modal);
		}

		// Change state
		this.active = true;

		// Clear input field
		this.$input.val('');
		this.modal.show();
	},

	search: function() {
		// Make sur the popup is opened
		if (!this.active) { return; }

		// Display all if there is no input
		if (this.$input.val())
		{
			// Let's fuzzy search
			var fuse = new Fuse(this.signs, Roadsign.Popup.FUSE_OPTIONS);
			var results = fuse.search(this.$input.val());
		}
		else
		{
			var results = this.signs;
		}

		// Update results
		this.updateResults(results);
	},

	updateResults: function(results)
	{
		// Clear old results...
		this.$results.html('');

		// And add new ones
		for (var i = 0; i < results.length; i++)
		{
			this.add(results[i]);
		}
		this.modal.updateSizeAndPosition();
	},

	add: function(sign) {
		var html = '<a href="'+sign.uri+'" class="roadsign-pane"><div class="roadsign-group"><span>'+sign.group+'</span></div><div class="roadsign-name"><span>'+sign.name+'</span></div></a>';
		this.$results.append(html);
	}

},
{
	F_KEY: 70,
	FUSE_OPTIONS: {
		keys: ['group', 'name']
	}
});

})(jQuery);
