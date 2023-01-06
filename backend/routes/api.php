<?php

use App\Http\Controllers\API\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('products', ProductController::class)->only([
    'destroy', 'show', 'store', 'update', 'index'
]);

Route::get('products/pages/{nregisters}',           [ProductController::class,  'pages']);

Route::get('products/search/byname/{name}',         [ProductController::class,  'searchByName']);
Route::get('products/search/byslug/{slug}',         [ProductController::class,  'searchBySlug']);
Route::get('products/search/bycategory/{category}', [ProductController::class,  'searchByCategory']);
Route::get('products/search/bybrand/{brand}',       [ProductController::class,  'searchByBrand']);

Route::get('products/other/table',            [ProductController::class, 'ajaxTable']);
Route::get('products/other/select2',          [ProductController::class, 'ajaxSelect2']);
Route::get('products/other/searchAll/{name}', [ProductController::class, 'searchAll']);
