<?php
namespace Craft;

/**
* Roadsign plugin
*/
class RoadsignPlugin extends BasePlugin
{
	public function getName()
	{
		return 'Roadsign';
	}

	public function getVersion()
	{
		return '0.9.1';
	}

	public function getDeveloper()
	{
		return 'Mario Friz';
	}

	public function getDeveloperUrl()
	{
		return 'http://craftshake.com';
	}

	public function init()
	{
		// Are we in Craft CP?
		if (craft()->request->isCpRequest() && craft()->userSession->isLoggedIn() && !craft()->request->isAjaxRequest())
		{
			// Let's get all signs
			$signs = craft()->roadsign->getAllSigns();

			// Render the template
			$html = craft()->templates->render('Roadsign/popup', array());
			craft()->templates->includeFootHtml($html);
			craft()->templates->includeJs('new Roadsign.Popup(' . JsonHelper::encode($signs) . ');');
		}
	}
}
