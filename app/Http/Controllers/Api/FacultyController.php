<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Faculty\GetAllRequest;
use App\Http\Requests\Faculty\StoreRequest;
use App\Models\Faculty;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacultyController extends Controller
{
    public function index(GetAllRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('faculty_view'), 403);

        $faculties = Faculty::with([
            'leader'
        ]);

        try {
            if ($request->search != null) {
                $faculties = $faculties->search($request->search);
            }
            $faculties = $faculties->paginate($request->per_page);
            return Reply::successWithData($faculties, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong');
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('faculty_create'), 403);
        $data = collect($request->validated())->except(['leader'])->toArray();
        DB::beginTransaction();

        try {
            $leader_id = User::whereRoleId(Role::ROLES['teacher'])
                ->where('shortcode', '=', $request->leader)->pluck('id')
                ->firstOrFail();
            $data['leader_id'] = $leader_id;
            Faculty::create($data);
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
        abort_if(!$user->hasPermission('faculty_view'), 403);

        try {
            $data = Faculty::with([
                'leader'
            ])->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong');
        }
    }

    public function update(Request $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('faculty_update'), 403);
        $data = collect($request->validated())->except(['leader'])->toArray();
        DB::beginTransaction();

        try {
            $faculty = Faculty::findOrFail($id);
            $leader_id = User::whereRoleId(Role::ROLES['teacher'])
                ->where('shortcode', '=', $request->leader)->pluck('id')
                ->firstOrFail();
            $data['leader_id'] = $leader_id;
            $faculty->update($data);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord', [], 500);
        }
    }

    public function destroy(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('faculty_delete'), 403);
        DB::beginTransaction();

        try {
            Faculty::destroy($id);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordDeleteSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord', [], 500);
        }
    }
    public function autocomplete(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('faculty_view'), 403);

        try {
            $school_classes = Faculty::search($request->search)->take(5)->get();
            return Reply::successWithData($school_classes, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }
}
