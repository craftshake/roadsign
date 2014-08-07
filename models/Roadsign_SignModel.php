<?php
namespace Craft;

class Roadsign_SignModel extends BaseModel
{
	protected function defineAttributes()
	{
		return array(
			'name' => AttributeType::String,
			'group' => AttributeType::String,
			'uri' => AttributeType::String,
		);
	}
}
