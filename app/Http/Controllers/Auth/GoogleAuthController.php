<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

public function callback()
{
    $googleUser = Socialite::driver('google')->stateless()->user();

    // Try to find user by provider_id first (better for social login)
    $user = User::where('provider', 'google')
                ->where('provider_id', $googleUser->getId())
                ->first();

    // If not found, check if user exists by email (in case user registered traditionally)
    if (!$user) {
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // If found by email, update provider info for future social logins
            $user->update([
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
            ]);
        } else {
            // Otherwise, create new user with provider info and null password
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
                'password' => null, // No password needed for social login
                'role' => 'user',
            ]);
        }
    }

    // Log the user in
    Auth::login($user);

    // Generate token (if you use Sanctum for API)
    $token = JWTAuth::fromUser($user);

return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);

}

}
