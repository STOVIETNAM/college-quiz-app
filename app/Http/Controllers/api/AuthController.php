<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\TokenAbility;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    function __construct()
    {
        parent::__construct();
        DB::delete('DELETE FROM personal_access_tokens
                WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);');
    }
    /**
     * Login
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);
        $user = User::with('role')->whereEmail($validated['email'])->first();

        if (!$user) return Reply::error('auth.errors.emailNotFound', [], 404);
        if ($user->is_active == false)  return Reply::error('auth.errors.accountDisabled');
        if (!Hash::check($validated['password'], $user->password)) {
            return Reply::error('auth.errors.passwordIncorrect');
        }
        $token = $user->createToken($user->role->name . ' token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return Reply::success();
    }
    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return Reply::error('auth.errors.passwordIncorrect');
        }
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        $user->tokens()->delete();
        return Reply::success();
    }
}
