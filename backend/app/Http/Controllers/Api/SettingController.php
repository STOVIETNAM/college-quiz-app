<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateRequest;
use App\Models\Setting;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

class SettingController extends Controller
{
    public array $callableCommands = [
        'app:cancel-late-exams',
        'app:cleanup-images',
        'app:clear-expired-otp-codes',
        'app:delete-never-used-questions',
        'sanctum:prune-expired',

        'schedule:run',

        'optimize',
        'optimize:clear',

        'route:cache',
        'route:clear',
        'cache:clear',
        'cache:forget',
        'clear-compiled',
        'config:cache',
        'config:clear',
        'view:cache',
        'view:clear',
        'event:clear',
    ];

    public function index()
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);

        try {
            $settings = Setting::all();
            return Reply::successWithData($settings, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);

        try {
            $validated_data = $request->validated()['data'];
            foreach ($validated_data as $setting_field) {
                if (
                    in_array($setting_field['key'], config('custom.setting_number_keys')) &&
                    !is_numeric($setting_field['value'])
                ) {
                    continue;
                }
                Setting::where('key', $setting_field['key'])
                    ->update([
                        'value' => $setting_field['value']
                    ]);
            }
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function getCommands(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        try {
            return Reply::successWithData($this->callableCommands, '');
        } catch (\Exception $error) {
            Log::error($error);
            return Reply::error(trans('app.errors.something_went_wrong'), 500);
        }
    }

    public function runArtisan(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        $command = $request->get('command');
        abort_if(!in_array($command, $this->callableCommands), 403);

        try {
            /**
             * Some command like "optimize" will force app reload all settings again.
             **/
            $message = trans('app.successes.command_run_successfully', ['command' => $command]);
            Artisan::call($command);
            return Reply::successWithMessage($message);
        } catch (\Exception $error) {
            Log::error($error);
            return Reply::error(trans('app.errors.something_went_wrong'), 500);
        }
    }

    public function getLogFile()
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        $log_file_path = storage_path('logs/laravel.log');
        if (File::exists($log_file_path)) {
            return response()->download($log_file_path);
        }
        return Reply::error(trans('app.errors.log_file_not_exist'));
    }

    public function deleteLogFile()
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        $log_file_path = storage_path('logs/laravel.log');
        File::delete($log_file_path);
        return Reply::successWithMessage(trans('app.successes.success'));
    }
}
