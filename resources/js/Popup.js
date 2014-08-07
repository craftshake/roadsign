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
	$selected: null,
	$input: null,
	$results: null,

	init: function(signsJSON) {
		// Populate signs to search through
		this.signs = signsJSON;

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

		// Select first result
		this.select(this.$results.children().first());

		// Search when input text has changed
		this.$input.on('textchange', function() {
			that.search();
		});

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
			else if (ev.keyCode == Garnish.UP_KEY)
			{
				var prev = that.$selected.prev();
				if (prev.length) {
					ev.preventDefault();

					// Select previous sign
					that.select(that.$selected.prev());
				}
			}
			else if (ev.keyCode == Garnish.DOWN_KEY)
			{
				var next = that.$selected.next();
				if (next.length) {
					ev.preventDefault();

					// Select next sign
					that.select(that.$selected.next());
				}
			}
			else if (ev.keyCode == Garnish.RETURN_KEY)
			{
				if (that.$selected != null)
				{
					ev.preventDefault();

					// Go to page
					window.location.href = that.$selected.attr('href');
				}
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

		// Reset selected result
		this.select(this.$results.children().first());
	},

	search: function() {
		// Make sur the popup is opened
		if (!this.active) { return; }

		console.log('Searching...');

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

		// Update modal
		this.modal.updateSizeAndPosition();

		// Reset selected result
		this.select(this.$results.children().first());
	},

	add: function(sign) {
		var html = '<a href="'+Craft.getUrl(sign.uri)+'" class="roadsign-pane"><div class="roadsign-group"><span>'+sign.group+'</span></div><div class="roadsign-name"><span>'+sign.name+'</span></div></a>';
		this.$results.append(html);
	},

	select: function(element)
	{
		if (this.$selected && this.$selected.hasClass('active'))
		{
			this.$selected.removeClass('active');
		}

		element.addClass('active');
		this.$selected = element;
	}
},
{
	F_KEY: 80,
	FUSE_OPTIONS: {
		keys: ['group', 'name']
	}
});

})(jQuery);
