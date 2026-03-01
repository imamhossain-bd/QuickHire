<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_id'      => ['required', 'integer', 'exists:jobs,id'],
            'name'        => ['required', 'string', 'min:2', 'max:255'],
            'email'       => ['required', 'email:rfc', 'max:255'],
            'resume_link' => ['nullable', 'url', 'max:500'],
            'cv_file'     => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'cover_note'  => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'job_id.required'   => 'Job ID is required.',
            'job_id.exists'     => 'The selected job does not exist.',
            'name.required'     => 'Your full name is required.',
            'name.min'          => 'Name must be at least 2 characters.',
            'email.required'    => 'Email address is required.',
            'email.email'       => 'Please provide a valid email address.',
            'resume_link.url'   => 'Resume link must be a valid URL.',
            'cv_file.mimes'     => 'CV must be a PDF, DOC, or DOCX file.',
            'cv_file.max'       => 'CV file size must not exceed 5MB.',
            'cover_note.max'    => 'Cover note must not exceed 2000 characters.',
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