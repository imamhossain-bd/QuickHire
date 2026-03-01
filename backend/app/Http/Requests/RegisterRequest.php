<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'max:255'],
            'email'     => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required'  => 'Full name is required.',
            'full_name.min'       => 'Full name must be at least 2 characters.',
            'email.required'      => 'Email address is required.',
            'email.email'         => 'Please enter a valid email address.',
            'email.unique'        => 'An account with this email already exists.',
            'password.required'   => 'Password is required.',
            'password.min'        => 'Password must be at least 8 characters.',
            'password.confirmed'  => 'Passwords do not match.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}