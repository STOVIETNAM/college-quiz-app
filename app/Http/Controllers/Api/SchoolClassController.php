<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\SchoolClass\GetAllRequest;
use App\Http\Requests\SchoolClass\StoreRequest;
use App\Models\Faculty;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SchoolClassController extends Controller
{
    public function index(GetAllRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_view'), 403);

        $school_classes = SchoolClass::withCount('students');

        try {
            if ($request->search != null) {
                $school_classes = $school_classes->search($request->search);
            }
            $school_classes = $school_classes->paginate($request->per_page);
            return Reply::successWithData($school_classes, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong');
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_create'), 403);
        $data = collect($request->validated())->except('faculty')->toArray();

        DB::beginTransaction();
        try {
            $faculty_id = Faculty::where('shortcode', '=', $request->faculty)
                ->pluck('id')->first();
            if ($faculty_id == false) return Reply::error('app.errors.faucltyNotExists', [
                'shortcodes' => $request->faculty
            ]);
            $data['faculty_id'] = $faculty_id;
            SchoolClass::create($data);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord', [], 500);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_view'), 403);

        try {
            $data = SchoolClass::withCount('students')->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong');
        }
    }

    public function update(StoreRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_update'), 403);
        $data = collect($request->validated())->except('faculty');

        DB::beginTransaction();
        try {
            $school_class = SchoolClass::findOrFail($id);

            $faculty_id = Faculty::where('shortcode', '=', $request->faculty)
                ->pluck('id')->first();
            if ($faculty_id == false) return Reply::error('app.errors.faucltyNotExists', [
                'shortcodes' => $request->faculty
            ]);

            $data['faculty_id'] = $faculty_id;
            $school_class->update($data);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord', [], 500);
        }
    }

    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_delete'), 403);
        DB::beginTransaction();

        try {
            SchoolClass::destroy($request->ids);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordDeleteSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }

    public function autocomplete(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('school_class_view'), 403);

        try {
            $school_classes = SchoolClass::search($request->search)->take(5)->get();
            return Reply::successWithData($school_classes, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }
}
