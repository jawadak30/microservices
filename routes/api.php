<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;



    // Route::get('/sanctum/csrf-cookie', function (Request $request) {
    //     $response = Http::withHeaders([
    //         'Cookie' => $request->header('Cookie', ''),
    //         'Accept' => 'application/json',
    //     ])->get(env('AUTH_SERVICE_URL') . '/sanctum/csrf-cookie');

    //     return response($response->body(), $response->status())
    //         ->withHeaders($response->headers());
    // });

    Route::get('/user', function (Request $request) {
        $headers = ['Accept' => 'application/json'];
        if ($token = $request->bearerToken()) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        $response = Http::withHeaders($headers)
            ->get(env('AUTH_SERVICE_URL') . '/api/user');

        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'));
    });

Route::post('/register', function (Request $request) {
    logger()->info('Register proxy request received:', $request->all());

    $response = Http::withHeaders([
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ])->post(env('AUTH_SERVICE_URL') . '/api/register', $request->all());

    logger()->info('Response from auth-service:', [
        'status' => $response->status(),
        'body' => $response->body(),
    ]);

    return response($response->body(), $response->status())
        ->header('Content-Type', $response->header('Content-Type'));
});


    Route::post('/login', function (Request $request) {
        $response = Http::post(env('AUTH_SERVICE_URL') . '/api/login', $request->json()->all());
        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'));
    });

    Route::post('/logout', function (Request $request) {
        $headers = ['Accept' => 'application/json'];

        if ($token = $request->bearerToken()) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        $response = Http::withHeaders($headers)->post(env('AUTH_SERVICE_URL') . '/api/logout');

        return response($response->body(), $response->status());
    });

    Route::get('/auth/redirect/google', function () {
        return redirect()->away(env('AUTH_SERVICE_URL') . '/api/auth/redirect/google');
    });

    Route::get('/auth/callback/google', function () {
        $response = Http::get(env('AUTH_SERVICE_URL') . '/api/auth/callback/google', request()->query());

        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'));
    });
