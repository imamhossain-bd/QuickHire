<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => ['sometimes', 'required', 'string', 'max:255'],
            'company'      => ['sometimes', 'required', 'string', 'max:255'],
            'company_logo' => ['nullable', 'string', 'max:500'],
            'location'     => ['sometimes', 'required', 'string', 'max:255'],
            'category'     => ['sometimes', 'required', 'string', 'max:100'],
            'job_type'     => ['sometimes', 'required', 'string', 'in:full-time,part-time,remote,contract,internship'],
            'salary_min'   => ['nullable', 'integer', 'min:0'],
            'salary_max'   => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
            'description'  => ['sometimes', 'required', 'string', 'min:50'],
            'requirements' => ['nullable', 'string'],
            'benefits'     => ['nullable', 'string'],
            'is_active'    => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Job title is required.',
            'company.required'     => 'Company name is required.',
            'location.required'    => 'Job location is required.',
            'category.required'    => 'Job category is required.',
            'job_type.required'    => 'Job type is required.',
            'job_type.in'          => 'Job type must be one of: full-time, part-time, remote, contract, internship.',
            'description.required' => 'Job description is required.',
            'description.min'      => 'Job description must be at least 50 characters.',
            'salary_max.gte'       => 'Maximum salary must be greater than or equal to minimum salary.',
            'company_logo.url'     => 'Company logo must be a valid URL.',
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
