<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Database\Events\QueryExecuted;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        Route::pattern('id', '([1-9]+[0-9]*)');

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(config('custom.app.default_rate_limit'))->by($request->user()?->id ?: $request->ip());
        });

        $this->configQueryLog();
    }

    private function configQueryLog(): void
    {
        if (config('app.debug') == true && !app()->runningInConsole())
            DB::listen(function (QueryExecuted $query) {
                Log::info($query->sql, [
                    'time' => "$query->time ms"
                ]);
            });
    }
}
