<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use DateTime;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
        return $this->okReponse($products->toArray());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $product = new Product;

        $product->name = $request->name;
        $product->category = $request->category;
        $product->brand = $request->brand;
        $product->slug = $request->slug;
        $product->status = $request->status;
        if ($product->status == null)
            $product->status = 1;

        $result = $product->save();
        if ($result)
            return $this->okReponse(['id' => $product->_id]);
        else
            return $this->errorResponse();
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);
        if ($product)
            return $this->okReponse($product->toArray());
        else
            return $this->errorResponse();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  String  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product)
            return $this->errorResponse();
        $product->name = $request->name;
        $product->category = $request->category;
        $product->brand = $request->brand;
        $product->slug = $request->slug;
        $product->status = $request->status;
        if ($product->status == null)
            $product->status = 1;

        $result = $product->save();
        if ($result)
            return $this->okReponse(['id' => $product->_id]);
        else
            return $this->errorResponse();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  String  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product)
            return $this->errorResponse();
        $product->status = 0;
        $product->save();
        return $this->okReponse();
    }

    /**
     * Get a number of registers
     *
     * @param  String  $registers
     * @return \Illuminate\Http\Response
     */
    public function pages($registers)
    {
        $registers = intval($registers);
        if ($registers == 0)
            return $this->errorResponse([], 'Parameter not is a number');
        $products = Product::paginate($registers);
        return $this->okReponse($products);
    }

    /**
     * Search a product by total o part of a name.
     *
     * @param  String  $name
     * @return \Illuminate\Http\Response
     */
    public function searchByName($name)
    {
        $data = Product::where('name', 'like', '%' . $name . '%')->get();
        return $this->okReponse($data);
    }

    /**
     * Search a product by total o part of a url.
     *
     * @param  String  $slug
     * @return \Illuminate\Http\Response
     */
    public function searchBySlug($slug)
    {
        $data = Product::where('slug', 'like', '%' . $slug . '%')->get();
        return $this->okReponse($data);
    }

    /**
     * Search a product by total o part of a name of category.
     *
     * @param  String  $category
     * @return \Illuminate\Http\Response
     */
    public function searchByCategory($category)
    {
        $data = Product::where('category.name', 'like', '%' . $category . '%')->get();
        return $this->okReponse($data);
    }

    /**
     * Search a product by total o part of a name of category.
     *
     * @param  String  $name
     * @return \Illuminate\Http\Response
     */
    public function searchByBrand($brand)
    {
        $data = Product::where('brand.name', 'like', '%' . $brand . '%')->get();
        return $this->okReponse($data);
    }

    /**
     * Send data for request of DataTable products
     *
     * @return \Illuminate\Http\Response
     */
    public function ajaxTable()
    {
        $productos = Product::where('status', 1)->get();

        $data = [];
        foreach ($productos as $producto)
        {
            $info['_id'] = $producto['_id'];
            $info['nameProduct'] = $producto['name'];
            $info['slugProduct'] = $producto['slug'];
            $info['nameCategory'] = $producto['category']['name'];
            $info['slugCategory'] = $producto['category']['slug'];
            $info['nameBrand'] = $producto['brand']['name'];
            $info['slugBrand'] = $producto['brand']['slug'];
            $info['statusProduct'] = $producto['status'];
            $date = new DateTime($producto['created_at']);
            $info['creationProduct'] = $date->format('Y-m-d H:i:s');
            array_push($data, $info);
        }
        return $this->okReponse($data);
    }

    /**
     * Send a default response of error
     *
     * @param  Array   $data
     * @param  String  $msg
     * @param  Integer $status
     * @return \Illuminate\Http\Response
     */
    private function errorResponse($data = [], $msg = 'Register not found', $status = 404)
    {
        return response()->json([
            'status' => $status,
            'msg'    => $msg,
            'data'   => $data
        ], $status);
    }

    /**
     * Send a default response of successful
     *
     * @param  Array   $data
     * @param  String  $msg
     * @param  Integer $status
     * @return \Illuminate\Http\Response
     */
    private function okReponse($data = [], $msg = 'OK', $status = 200)
    {
        return response()->json([
            'status' => $status,
            'msg'    => $msg,
            'data'   => $data
        ], $status);
    }
}
