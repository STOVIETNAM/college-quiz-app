<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chapter\StoreRequest;
use App\Http\Requests\Chapter\UpdateRequest;
use App\Models\Chapter;
use Illuminate\Support\Facades\DB;

class ChapterController extends Controller
{
    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SUBJECT_UPDATE), 403);

        DB::beginTransaction();
        try {
            Chapter::create($request->validated());
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SUBJECT_UPDATE), 403);

        DB::beginTransaction();
        try {
            $chapter = Chapter::findOrFail($id);
            $chapter->update($request->validated());
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SUBJECT_UPDATE), 403);

        DB::beginTransaction();
        try {
            Chapter::destroy($id);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_delete_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
