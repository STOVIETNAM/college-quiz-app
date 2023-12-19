<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SchoolClassController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function index(Request $request)
    {
        // $user = $this->getUser();
        try {
            if ($request->search != null) {
                $data = SchoolClass::search($request->search);
            } else $data = SchoolClass::all();
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function store(Request $request)
    {
        //
    }
    public function show(string $id)
    {
        try {
            $data = SchoolClass::withCount('students')->find($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function update(Request $request, string $id)
    {
        //
    }
    public function destroy(string $id)
    {
        //
    }
}
