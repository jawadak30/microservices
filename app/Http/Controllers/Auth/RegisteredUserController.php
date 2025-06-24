<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Tymon\JWTAuth\Facades\JWTAuth;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:'.User::class,
                // remove 'lowercase' rule if it's custom, just strtolower below
            ],
            'password' => [
                $request->has('provider') ? 'nullable' : 'required',
                'confirmed',
                Rules\Password::defaults(),
            ],
            'provider' => ['nullable', 'string'],
            'provider_id' => ['nullable', 'string', 'unique:users,provider_id'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => $request->password ? Hash::make($request->password) : null,
            'role' => 'user',
            'provider' => $request->provider ?? null,
            'provider_id' => $request->provider_id ?? null,
        ]);

        event(new Registered($user));

        // Generate JWT token for the user
        $token = JWTAuth::fromUser($user);

        // Return user data and token in response
        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}
