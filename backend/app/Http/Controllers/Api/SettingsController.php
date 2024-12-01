<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SettingsController extends Controller
{
    public array $callableCommands = [
        'app:cancel-late-exams',
        'app:cleanup-images',
        'app:clear-expired-otp-codes',
        'app:clear-unsed-tokens',

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

    public function getCommands(Request $request)
    {
        try {
            return Reply::successWithData($this->callableCommands, '');
        } catch (\Exception $error) {
            Log::error($error);
            return Reply::error('app.errors.something_went_wrong', [], 500);
        }
    }

    public function runArtisan(Request $request)
    {
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
            return Reply::error('app.errors.something_went_wrong', [], 500);
        }
    }

    public function getLogFile()
    {
        abort_if(!$this->getUser()->isAdmin(), 403);
        $log_file_path = storage_path('logs/laravel.log');
        if (File::exists($log_file_path)) {
            return response()->download($log_file_path);
        }
        return Reply::error('app.errors.log_file_not_exist');
    }

    public function deleteLogFile()
    {
        abort_if(!$this->getUser()->isAdmin(), 403);
        $log_file_path = storage_path('logs/laravel.log');
        File::delete($log_file_path);
        return Reply::successWithMessage('app.successes.success');
    }
}
