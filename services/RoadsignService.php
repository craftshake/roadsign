<?php
namespace Craft;

/**
* Roadsign service
*/
class RoadsignService extends BaseApplicationComponent
{
	/**
	* Returns all available signs
	*
	* @return array
	*/
	public function getAllSigns()
	{
		$groups = array();
		$allSigns = array();

		$groups += $this->getSystemSettingsSigns();
		$groups += $this->getContentSettingsSigns();
		$groups += $this->getEntriesSigns();

		foreach ($groups as $group => $signs) {
			foreach ($signs as $sign => $uri) {
				$model = new Roadsign_SignModel();
				$model->name = Craft::t($sign);
				$model->group = Craft::t($group);
				$model->uri = $uri;
				$allSigns[] = $model;
			}
		}

		return $allSigns;
	}

	private function getSystemSettingsSigns()
	{
		$signs = array(
			'All settings' => 'settings',
			'General' => 'settings/general',
			'Routes' => 'settings/routes',
			'Users' => 'settings/users',
			'Email' => 'settings/email',
			'Plugins' => 'settings/plugins'
		);

		return array(
			'System' => $signs
		);
	}

	private function getContentSettingsSigns()
	{
		$signs = array(
			'Fields' => 'settings/fields',
			'Sections' => 'settings/sections',
			'Assets' => 'settings/assets',
			'Globals' => 'settings/globals',
			'Categories' => 'settings/categories',
			'Tags' => 'settings/tags'
		);

		return array(
			'Content' => $signs
		);
	}

	private function getEntriesSigns()
	{
		$sections = craft()->sections->getEditableSections();

		$signs = array();

		foreach ($sections as $section) {
			if ($section->type != 'single' && craft()->userSession->getUser()->can('createEntries:'.$section->id))
			{
				$signs[$section->name] = 'entries/' . $section->handle . '/new';
			}
		}

		return array(
			'Entries' => $signs
		);
	}
}
