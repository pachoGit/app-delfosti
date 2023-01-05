<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as MongoModel;

class Product extends MongoModel
{
    protected $collection = 'products';
}
